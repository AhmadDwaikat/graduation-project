const User = require('../models/User');
const Event = require('../models/Event');
const { TfidfVectorizer, cosineSimilarity } = require('../utils/similarityUtils');

const getUserRatings = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return user.ratings;
};

const calculateCosineSimilarity = (vectorA, vectorB) => {
  const dotProduct = vectorA.reduce((sum, a, idx) => sum + a * vectorB[idx], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

const getUserSimilarity = async (userAId, userBId) => {
  const ratingsA = await getUserRatings(userAId);
  const ratingsB = await getUserRatings(userBId);

  const commonEvents = ratingsA.filter(a => ratingsB.some(b => b.eventId.equals(a.eventId)));

  if (commonEvents.length === 0) return 0;

  const vectorA = commonEvents.map(r => r.rating);
  const vectorB = commonEvents.map(r => ratingsB.find(b => b.eventId.equals(r.eventId)).rating);

  return calculateCosineSimilarity(vectorA, vectorB);
};

const getTopNSimilarUsers = async (userId, n = 6) => {
  const otherUsers = await User.find({ _id: { $ne: userId } });

  const similarities = await Promise.all(
    otherUsers.map(async (otherUser) => {
      const similarity = await getUserSimilarity(userId, otherUser._id);
      return { userId: otherUser._id, similarity };
    })
  );

  similarities.sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, n);
};

const predictEventRating = async (userId, eventId) => {
  const similarUsers = await getTopNSimilarUsers(userId);

  const weightedSum = await similarUsers.reduce(async (sum, { userId: similarUserId, similarity }) => {
    const similarUserRatings = await getUserRatings(similarUserId);
    const similarUserRating = similarUserRatings.find(r => r.eventId.equals(eventId))?.rating;
    return similarUserRating ? sum + similarUserRating * similarity : sum;
  }, 0);

  const similaritySum = similarUsers.reduce((sum, { similarity }) => sum + similarity, 0);

  return similaritySum === 0 ? 0 : weightedSum / similaritySum;
};

const getEventContentVector = (event) => {
  return `${event.category} ${event.description}`;
};

const getUserContentVector = (user) => {
  return user.interests.join(' ');
};

const recommendEvents = async (userId) => {
  const user = await User.findById(userId);
  const events = await Event.find({ creator: { $ne: userId } });

  // Predict ratings using collaborative filtering
  const eventPredictions = await Promise.all(
    events.map(async (event) => ({
      event,
      predictedRating: await predictEventRating(userId, event._id),
    }))
  );

  // Calculate content-based similarity
  const userContentVector = getUserContentVector(user);
  const vectorizer = new TfidfVectorizer();
  const eventContentVectors = vectorizer.transform(events.map(getEventContentVector));
  const userContentVectorTfidf = vectorizer.transform([userContentVector])[0];

  const contentSimilarities = events.map((event, index) => ({
    event,
    similarity: cosineSimilarity(userContentVectorTfidf, eventContentVectors[index])
  }));

  // Combine both methods
  const hybridRecommendations = eventPredictions.map(prediction => {
    const contentSimilarity = contentSimilarities.find(cs => cs.event._id.equals(prediction.event._id)).similarity;
    return {
      event: prediction.event,
      hybridScore: prediction.predictedRating * 0.5 + contentSimilarity * 0.5 // Adjust weights as needed
    };
  });

  // Sort by hybrid score and limit to top 6
  hybridRecommendations.sort((a, b) => b.hybridScore - a.hybridScore);

  return hybridRecommendations.slice(0, 6);
};

exports.recommendEvents = async (req, res) => {
  try {
    const userId = req.user.id;  // Assuming the user is authenticated and their ID is in req.user.id
    const recommendedEvents = await recommendEvents(userId);
    res.status(200).json({ success: true, data: recommendedEvents });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

