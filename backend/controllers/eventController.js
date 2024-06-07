const Event = require('../models/Event');

// Create a new event
const createEvent = async (req, res) => {
  const { name, date, description } = req.body;

  try {
    const event = new Event({ name, date, description });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(`Error creating event: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error(`Error fetching events: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single event
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(`Error fetching event: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  const { name, date, description } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.name = name || event.name;
    event.date = date || event.date;
    event.description = description || event.description;

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    console.error(`Error updating event: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.remove();
    res.status(200).json({ message: 'Event removed' });
  } catch (error) {
    console.error(`Error deleting event: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};
