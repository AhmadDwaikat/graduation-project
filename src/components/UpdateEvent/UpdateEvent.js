import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './UpdateEvent.css';

const initialEventTypes = {
  Sports: ['Soccer', 'Basketball', 'Tennis', 'Running', 'Yoga', 'Swimming', 'Cycling', 'Hiking', 'Martial Arts', 'Golf'],
  Music: ['Concerts', 'Music Festivals', 'Open Mic Nights', 'Classical Music', 'Jazz', 'Rock', 'Pop', 'EDM', 'Hip-Hop', 'Karaoke'],
  'Art and Culture': ['Art Exhibitions', 'Theater Performances', 'Museums', 'Literature and Book Clubs', 'Poetry Readings', 'Dance Performances', 'Cultural Festivals', 'Photography', 'Craft Workshops', 'Historical Tours'],
  Technology: ['Tech Conferences', 'Coding Bootcamps', 'Hackathons', 'Start-up Meetups', 'Gadget Expos', 'Robotics', 'AI and Machine Learning', 'Virtual Reality', 'Game Development', 'Blockchain and Cryptocurrency'],
  'Food and Drink': ['Food Festivals', 'Wine Tasting', 'Cooking Classes', 'Restaurant Openings', 'Brewery Tours', 'Street Food', 'Vegan and Vegetarian Events', 'Coffee Tastings', 'Baking Workshops', 'Cocktail Mixing'],
  'Health and Wellness': ['Fitness Classes', 'Meditation', 'Mental Health Workshops', 'Nutrition Seminars', 'Wellness Retreats', 'Spa Days', 'Holistic Healing', 'Running Clubs', 'Health Fairs', 'Personal Development'],
  'Outdoor and Adventure': ['Camping', 'Rock Climbing', 'Scuba Diving', 'Skiing and Snowboarding', 'Surfing', 'Wildlife Tours', 'Kayaking', 'Paragliding', 'Fishing', 'Eco-Tours'],
  'Community and Volunteering': ['Charity Events', 'Community Clean-ups', 'Fundraisers', 'Blood Drives', 'Animal Shelter Volunteering', 'Senior Care', 'Environmental Conservation', 'Homeless Shelters', 'Tutoring and Mentoring', 'Political Activism'],
  'Education and Learning': ['Language Classes', 'Public Lectures', 'Science Fairs', 'Book Readings', 'History Talks', 'Skill-Building Workshops', 'Online Courses', 'Educational Tours', 'Art Classes', 'Professional Development'],
  'Gaming and Esports': ['Esports Tournaments', 'Board Game Nights', 'RPG Sessions', 'Card Game Tournaments', 'Video Game Meetups', 'Cosplay Events', 'Game Development Workshops', 'Puzzle Hunts', 'Arcade Nights', 'Fantasy Sports'],
  Workshops: ['Hands-on Learning', 'Skill Development', 'Interactive Sessions', 'Small Group Classes'],
  'Social Gatherings': ['Networking Events', 'Meet and Greets', 'Parties', 'Social Mixers'],
  'Outdoor Activities': ['Picnics', 'Nature Walks', 'Sports Games', 'Adventure Trips'],
  Performances: ['Live Music', 'Theater Shows', 'Dance Performances', 'Comedy Shows'],
  Exhibitions: ['Art Shows', 'Trade Shows', 'Science Exhibitions', 'Auto Shows'],
  Conferences: ['Industry Conferences', 'Academic Conferences', 'Tech Summits', 'Business Forums'],
  'Classes and Seminars': ['Educational Lectures', 'Fitness Classes', 'Cooking Classes', 'Language Lessons'],
  Festivals: ['Music Festivals', 'Food Festivals', 'Cultural Festivals', 'Film Festivals'],
  'Volunteering Events': ['Charity Work', 'Community Service', 'Environmental Clean-ups', 'Fundraising Events'],
  Competitions: ['Sports Tournaments', 'Talent Shows', 'Hackathons', 'Quiz Competitions'],
};

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    category: '',
    location: '',
    participantLimit: '',
    eventType: '',
  });
  const [eventTypes] = useState(initialEventTypes);
  const [selectedEventType, setSelectedEventType] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data && response.data.success) {
          setEvent(response.data.data);
          setSelectedEventType(response.data.data.eventType || '');
        }
      } catch (error) {
        console.error('Error fetching event details:', error.message);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleEventTypeChange = (e) => {
    const newEventType = e.target.value;
    setSelectedEventType(newEventType);
    setEvent({ ...event, eventType: newEventType, category: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/events/${id}`,
        event,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data && response.data.success) {
        navigate(`/event-organizer/${id}`);
      }
    } catch (error) {
      console.error('Error updating event:', error.message);
    }
  };

  return (
    <Container maxWidth="lg" className="update-event-container">
      <Box className="event-box">
        <Box className="event-info">
          <Typography variant="h4" className="title">Update Event</Typography>
          <Box className="info-box">
            <Typography variant="body1">
              Use the form below to update the event details. Ensure that all fields are filled out accurately.
            </Typography>
          </Box>
        </Box>
        <Box className="event-form-container">
          <form onSubmit={handleSubmit} className="event-form">
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              name="title"
              value={event.title}
              onChange={handleChange}
              className="input-field"
              InputProps={{
                style: { borderColor: '#1d3124' },
              }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              name="description"
              value={event.description}
              onChange={handleChange}
              className="input-field"
              InputProps={{
                style: { borderColor: '#1d3124' },
              }}
            />
            <Box className="date-time-container">
              <TextField
                label="Date"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                name="date"
                value={event.date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                className="input-field date-field"
                InputProps={{
                  style: { borderColor: '#1d3124' },
                }}
              />
              <TextField
                label="Time"
                type="time"
                variant="outlined"
                fullWidth
                margin="normal"
                name="time"
                value={event.time}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                className="input-field time-field"
                InputProps={{
                  style: { borderColor: '#1d3124' },
                }}
              />
            </Box>
            <Box className="location-participant-container">
              <TextField
                label="Location"
                variant="outlined"
                fullWidth
                margin="normal"
                name="location"
                value={event.location}
                onChange={handleChange}
                className="input-field location-field"
                InputProps={{
                  style: { borderColor: '#1d3124' },
                }}
              />
              <TextField
                label="Participant Limit"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                name="participantLimit"
                value={event.participantLimit}
                onChange={handleChange}
                className="input-field participant-field"
                InputProps={{
                  style: { borderColor: '#1d3124' },
                }}
              />
            </Box>
            <FormControl fullWidth variant="outlined" margin="normal" className="input-field event-field">
              <InputLabel>Event Type</InputLabel>
              <Select
                label="Event Type"
                value={selectedEventType}
                onChange={handleEventTypeChange}
                style={{ borderColor: '#1d3124' }}
              >
                {Object.keys(eventTypes).map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedEventType && (
              <FormControl fullWidth variant="outlined" margin="normal" className="input-field category-field">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={event.category}
                  onChange={handleChange}
                  name="category"
                  style={{ borderColor: '#1d3124' }}
                >
                  {eventTypes[selectedEventType].map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              className="submit-button"
            >
              Update Event
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateEvent;
