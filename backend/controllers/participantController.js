const Event = require('../models/Event');
const User = require('../models/User');

exports.getParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('participants.user', 'name profilePicture');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event.participants });
  } catch (error) {
    console.error('Error fetching participants:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Update participant status
exports.updateParticipantStatus = async (req, res) => {
  try {
    const { action } = req.body;
    const { eventId, participantId } = req.params;

    const event = await Event.findById(eventId).populate('participants.user', 'name profilePicture');
    const user = await User.findById(participantId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const participant = event.participants.find(p => p.user._id.toString() === participantId);

    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    switch (action) {
      case 'approve':
        participant.status = 'approved';
        user.joinedEvents.push(eventId);
        user.requestedEvents = user.requestedEvents.filter(id => id.toString() !== eventId);
        break;
      case 'reject':
        participant.status = 'rejected';
        user.requestedEvents = user.requestedEvents.filter(id => id.toString() !== eventId);
        user.joinedEvents = user.joinedEvents.filter(id => id.toString() !== eventId);
        break;
      case 'remove':
        event.participants = event.participants.filter(p => p.user._id.toString() !== participantId);
        user.joinedEvents = user.joinedEvents.filter(id => id.toString() !== eventId);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    await event.save();
    await user.save();

    res.status(200).json({ success: true, message: 'Participant status updated', data: event.participants });
  } catch (error) {
    console.error('Error updating participant status:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

