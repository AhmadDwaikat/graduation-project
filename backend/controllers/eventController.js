const Event = require('../models/Event');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, description, date, time, eventType, category, location, participantLimit } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      time,
      eventType,
      category,
      location,
      participantLimit,
      creator: req.user.id, // Ensure the creator field is populated
    });

    await event.save();

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error during event creation' });
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
      .populate('creator', 'name') // Populate creator's name
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

    // Calculate average rating
    const totalRatings = event.ratings.reduce((acc, r) => acc + r.rating, 0);
    event.averageRating = totalRatings / event.ratings.length;

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

// Get high-rated events that the user did not create
exports.getHighRatedEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ creator: { $ne: userId } }).sort({ averageRating: -1 }).limit(10);
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching high-rated events:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get organizer event detail
exports.getOrganizerEventDetail = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants', 'name')
      .populate('ratings.user', 'name')
      .populate('comments.user', 'name');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this event' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching organizer event detail:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addMediaToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      console.error('Event not found');
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user.id) {
      console.error('Unauthorized to update this event');
      return res.status(403).json({ success: false, message: 'Unauthorized to update this event' });
    }

    const media = req.files.map(file => ({
      path: file.path.replace(/\\/g, '/'), // Ensure consistent path format
      mimetype: file.mimetype,
    }));

    media.forEach(file => {
      if (file.mimetype.startsWith('image/')) {
        event.images.push(file.path);
      } else if (file.mimetype.startsWith('video/')) {
        event.videos.push(file.path);
      }
    });

    await event.save();

    console.log('Media added successfully:', media);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error('Error adding media to event:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete media (image or video)
exports.deleteMedia = async (req, res) => {
  const { type, file } = req.params;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized request' });
    }

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const filePath = path.join(uploadsDir, file);
    console.log(`Attempting to delete ${type}: ${filePath}`);

    const mediaArray = type === 'image' ? event.images : event.videos;
    const fileIndex = mediaArray.findIndex((media) => media.endsWith(file));

    if (fileIndex > -1) {
      if (type === 'image') {
        event.images.splice(fileIndex, 1);
      } else {
        event.videos.splice(fileIndex, 1);
      }

      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err.message);
          return res.status(500).json({ success: false, message: `Error deleting file: ${err.message}` });
        } else {
          console.log(`File ${filePath} deleted successfully`);
          await event.save();
          return res.status(200).json({ success: true, data: event, message: `${type} deleted successfully` });
        }
      });
    } else {
      console.error(`${type} not found in event: ${file}`);
      return res.status(404).json({ success: false, message: `${type} not found in event` });
    }
  } catch (error) {
    console.error(`Error deleting ${type}:`, error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
// Remove a participant from an event
exports.removeParticipant = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.params.userId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const participantIndex = event.participants.findIndex(p => p.user.toString() === req.params.userId && p.status === 'approved');
    const userRequestIndex = user.requestedEvents.findIndex(r => r.toString() === req.params.id);

    if (participantIndex === -1) {
      return res.status(400).json({ success: false, message: 'User not part of this event' });
    }

    event.participants.splice(participantIndex, 1);
    user.requestedEvents.splice(userRequestIndex, 1);

    await event.save();
    await user.save();

    res.status(200).json({ success: true, message: 'Participant removed successfully' });
  } catch (error) {
    console.error('Error removing participant:', error.message);
    res.status(500).json({ success: false, message: 'Error removing participant: ' + error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching all events:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// Add event to favorites
exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const eventId = req.params.id;

    if (!user.favorites.includes(eventId)) {
      user.favorites.push(eventId);
      await user.save();
    }

    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    console.error('Error adding favorite event:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove event from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const eventId = req.params.id;

    user.favorites = user.favorites.filter(fav => fav.toString() !== eventId);
    await user.save();

    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    console.error('Error removing favorite event:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user's favorite events
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    console.error('Error fetching favorite events:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get upcoming events created by the logged-in user
exports.getUserCreatedUpcomingEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ 
      creator: userId, 
      date: { $gte: new Date() } 
    }).sort({ date: 1 });

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching upcoming events:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get past events created by the logged-in user
exports.getUserCreatedPastEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ 
      creator: userId, 
      date: { $lt: new Date() } 
    }).sort({ date: -1 });

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching past events:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// Request to join an event
exports.requestJoinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!event) {
      console.error('Event not found');
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!user) {
      console.error('User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingRequest = event.participants.find(p => p.user && p.user.toString() === req.user.id);
    if (existingRequest) {
      event.participants.find(p => p.user && p.user.toString() === req.user.id).status = 'requested'
    } else {
      event.participants.push({ user: req.user.id, status: 'requested' });
    }

    user.requestedEvents = user.requestedEvents || [];
    user.requestedEvents.push(event._id);

    await event.save();
    await user.save();

    res.status(200).json({ success: true, message: 'Join request sent successfully' });
  } catch (error) {
    console.error('Error sending join request:', error.message);
    res.status(500).json({ success: false, message: 'Error sending join request: ' + error.message });
  }
};

// Approve a user's join request
exports.approveJoinRequest = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.params.userId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const participant = event.participants.find(p => p.user.toString() === req.params.userId && p.status === 'requested');
    const userRequest = user.requestedEvents.find(r => r.toString() === req.params.id);

    if (!participant || !userRequest) {
      return res.status(400).json({ success: false, message: 'Join request not found' });
    }

    participant.status = 'approved';
    userRequest.status = 'joined';

    await event.save();
    await user.save();

    res.status(200).json({ success: true, message: 'Join request approved successfully' });
  } catch (error) {
    console.error('Error approving join request:', error.message);
    res.status(500).json({ success: false, message: 'Error approving join request: ' + error.message });
  }
};

// Reject a user's join request
exports.rejectJoinRequest = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.params.userId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const participant = event.participants.find(p => p.user.toString() === req.params.userId && p.status === 'requested');
    const userRequest = user.requestedEvents.find(r => r.toString() === req.params.id);

    if (!participant || !userRequest) {
      return res.status(400).json({ success: false, message: 'Join request not found' });
    }

    event.participants = event.participants.filter(p => p.user.toString() !== req.params.userId);
    user.requestedEvents = user.requestedEvents.filter(r => r.toString() !== req.params.id);

    await event.save();
    await user.save();

    res.status(200).json({ success: true, message: 'Join request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting join request:', error.message);
    res.status(500).json({ success: false, message: 'Error rejecting join request: ' + error.message });
  }
};

// Unsend request to join an event
exports.unsendRequestJoinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const participantIndex = event.participants.findIndex(p => p.user && p.user.toString() === req.user.id && p.status === 'requested');
    const userRequestIndex = user.requestedEvents.findIndex(r => r.toString() === req.params.id);

    if (participantIndex === -1) {
      return res.status(400).json({ success: false, message: 'No pending join request found' });
    }

    if (userRequestIndex === -1) {
      return res.status(400).json({ success: false, message: 'Join request not found in user database' });
    }

    event.participants.splice(participantIndex, 1);
    user.requestedEvents.splice(userRequestIndex, 1);

    await event.save();
    await user.save();

    res.status(200).json({ success: true, message: 'Join request unsent successfully' });
  } catch (error) {
    console.error('Error unsending join request:', error.message);
    res.status(500).json({ success: false, message: 'Error unsending join request: ' + error.message });
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

    const participantIndex = event.participants.findIndex(p => p.user.toString() === req.user.id && p.status === 'approved');
    const userJoinedIndex = user.joinedEvents.findIndex(r => r.toString() === req.params.id);

    if (participantIndex === -1) {
      return res.status(400).json({ success: false, message: 'User not part of this event' });
    }

    event.participants.splice(participantIndex, 1);
    user.joinedEvents.splice(userJoinedIndex, 1);

    await event.save();
    await user.save();

    res.status(200).json({ success: true, message: 'Left event successfully' });
  } catch (error) {
    console.error('Error leaving event:', error.message);
    res.status(500).json({ success: false, message: 'Error leaving event: ' + error.message });
  }
};