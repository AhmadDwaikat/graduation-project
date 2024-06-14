const Event = require('../models/Event');

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
      creator: req.user.id, // Assuming you have user authentication in place
    });

    const savedEvent = await event.save();
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error(`Error fetching events: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error(`Error fetching event: ${error.message}`);
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

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.category = category || event.category;
    event.location = location || event.location;
    event.participantLimit = participantLimit || event.participantLimit;

    await event.save();
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error(`Error updating event: ${error.message}`);
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

    await event.remove();
    res.status(200).json({ success: true, message: 'Event removed' });
  } catch (error) {
    console.error(`Error deleting event: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};