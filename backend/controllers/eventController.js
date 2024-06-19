const Event = require('../models/Event');
const User = require('../models/User');

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, description, date, time, category, location, participantLimit } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      time,
      category,
      location,
      participantLimit,
      creator: req.user.id,
    });

    const savedEvent = await event.save();
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all events created by the logged-in user
exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ creator: req.user.id });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching user events:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('ratings.user', 'name') // Populate user information in ratings
      .populate('comments.user', 'name'); // Populate user information in comments

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  const { title, description, date, time, category, location, participantLimit } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this event' });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.category = category || event.category;
    event.location = location || event.location;
    event.participantLimit = participantLimit || event.participantLimit;

    const updatedEvent = await event.save();
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this event' });
    }

    await event.remove();
    res.status(200).json({ success: true, message: 'Event removed' });
  } catch (error) {
    console.error('Error deleting event:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get events not created by the logged-in user
exports.getNonCreatedEvents = async (req, res) => {
  try {
    const events = await Event.find({ creator: { $ne: req.user.id } });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching non-created events:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Join an event
exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'User already joined this event' });
    }

    event.participants.push(req.user.id);
    user.joinedEvents.push(event._id);

    await event.save();
    await user.save();

    res.status(200).json({ success: true, message: 'Joined event successfully' });
  } catch (error) {
    console.error('Error joining event:', error.message);
    res.status(500).json({ success: false, message: 'Error joining event: ' + error.message });
  }
};

// Leave an event
exports.leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const participantIndex = event.participants.indexOf(req.user.id);
    const eventIndex = user.joinedEvents.indexOf(event._id);

    if (participantIndex === -1) {
      return res.status(400).json({ success: false, message: 'User not part of this event' });
    }

    event.participants.splice(participantIndex, 1);
    user.joinedEvents.splice(eventIndex, 1);

    await event.save();
    await user.save();

    res.status(200).json({ success: true, message: 'Left event successfully' });
  } catch (error) {
    console.error('Error leaving event:', error.message);
    res.status(500).json({ success: false, message: 'Error leaving event: ' + error.message });
  }
};

// Get upcoming events that the user has participated in
exports.getUserUpcomingEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'joinedEvents',
      match: { date: { $gte: new Date() } }
    });
    res.status(200).json({ success: true, data: user.joinedEvents });
  } catch (error) {
    console.error('Error fetching upcoming events:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get past events that the user has participated in
exports.getUserPastEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'joinedEvents',
      match: { date: { $lt: new Date() } }
    });
    res.status(200).json({ success: true, data: user.joinedEvents });
  } catch (error) {
    console.error('Error fetching past events:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// Submit or update a rating
exports.rateEvent = async (req, res) => {
  try {
    const { rating } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const existingRating = event.ratings.find(r => r.user.toString() === req.user.id);

    if (existingRating) {
      existingRating.rating = rating;  // Update existing rating
    } else {
      event.ratings.push({ user: req.user.id, rating });  // Add new rating
    }

    await event.save();

    res.status(200).json({ success: true, message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Submit a comment
exports.commentEvent = async (req, res) => {
  try {
    const { comment } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.comments.push({ user: req.user.id, comment });
    await event.save();

    res.status(200).json({ success: true, message: 'Comment submitted successfully' });
  } catch (error) {
    console.error('Error submitting comment:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};