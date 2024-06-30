const Event = require('../models/Event');
//const User = require('../models/User');

exports.getParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log('Received eventId:', eventId); // Log the eventId for debugging
    const event = await Event.findById(eventId).populate('participants.user', 'name profilePicture');
    if (!event) {
      console.error('Event not found for eventId:', eventId);
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event.participants });
  } catch (error) {
    console.error('Server error while fetching participants:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateParticipantStatus = async (req, res) => {
  const { action } = req.body;
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const participant = event.participants.find(p => p.user.toString() === req.params.participantId);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    participant.status = action === 'accept' ? 'confirmed' : 'rejected';
    await event.save();
    res.status(200).json({ success: true, data: event.participants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.sendNotification = async (req, res) => {
  // Implement notification sending logic
  res.status(200).json({ success: true, message: 'Notification sent' });
};

exports.sendMessage = async (req, res) => {
  // Implement message sending logic
  res.status(200).json({ success: true, message: 'Message sent' });
};
