const User = require('../models/User');
const Event = require('../models/Event');
const { TfidfVectorizer, cosineSimilarity } = require('../utils/similarityUtils');

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(500).json({ success: false, message: 'Recommendation data is not available.' });
    }

    // Fetch events not created by the user
    const events = await Event.find({ creator: { $ne: userId } }).select('_id title category date location averageRating');

    const vectorizer = new TfidfVectorizer();
    const userInterests = [user.interests.join(' ')];
    const eventCategories = events.map(event => event.category);

    const userVector = vectorizer.transform(userInterests)[0];
    const eventVectors = vectorizer.transform(eventCategories);

    const eventScores = events.map((event, index) => ({
      event,
      score: cosineSimilarity(userVector, eventVectors[index]),
    }));

    eventScores.sort((a, b) => b.score - a.score);
    const topEvents = eventScores.slice(0, 6).map(es => es.event);  // Limit to 6 events

    res.status(200).json({ success: true, data: topEvents });
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching recommendations.' });
  }
};
