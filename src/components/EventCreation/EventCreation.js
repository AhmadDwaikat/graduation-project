import React from 'react';
import { useForm } from 'react-hook-form';
import { Typography, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import './EventCreation.css';

const eventTypes = {
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

const EventCreation = () => {
  const { dispatch } = useEvent();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError, clearErrors, watch } = useForm();
  const selectedEventType = watch('eventType', '');

  const onSubmit = async (data) => {
    clearErrors();
    console.log('Submitting event creation form with data:', data);
    try {
      const response = await fetch('http://localhost:5000/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('Response from server:', result);
      if (response.ok) {
        dispatch({ type: 'create_event', payload: result });
        navigate('/dashboard');
      } else {
        console.error(result.message);
        setError('apiError', { type: 'manual', message: result.message });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setError('apiError', { type: 'manual', message: 'An unexpected error occurred. Please try again later.' });
    }
  };

  return (
    <Container maxWidth="lg" className="event-creation-container">
      <Box className="event-box">
        <Box className="event-info">
          <Typography variant="h4" className="title">Create Event</Typography>
          <Box className="info-box">
            <Typography variant="body1">
            Welcome to the event creation page! Here, you can create events for various categories. Please fill out the form below with accurate details to ensure your event is successfully created and reaches the right audience. Make sure to provide a descriptive title, detailed description, and accurate date, time, and location for your event. Select the appropriate event type and category to categorize your event correctly. We look forward to seeing the events you create!                 </Typography>
          </Box>
        </Box>
        <Box className="event-form-container">
          <form onSubmit={handleSubmit(onSubmit)} className="event-form">
            <TextField
              {...register('title', { required: 'Title is required' })}
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title ? errors.title.message : ''}
              className="input-field"
              InputProps={{
                style: { borderColor: '#1d3124' },
              }}
            />
            <TextField
              {...register('description', { required: 'Description is required' })}
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ''}
              className="input-field"
              InputProps={{
                style: { borderColor: '#1d3124' },
              }}
            />
            <Box className="date-time-container">
              <TextField
                {...register('date', { required: 'Date is required' })}
                label="Date"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.date}
                helperText={errors.date ? errors.date.message : ''}
                InputLabelProps={{
                  shrink: true,
                }}
                className="input-field date-field"
                InputProps={{
                  style: { borderColor: '#1d3124' },
                }}
              />
              <TextField
                {...register('time', { required: 'Time is required' })}
                label="Time"
                type="time"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.time}
                helperText={errors.time ? errors.time.message : ''}
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
                {...register('location', { required: 'Location is required' })}
                label="Location"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.location}
                helperText={errors.location ? errors.location.message : ''}
                className="input-field location-field"
                InputProps={{
                  style: { borderColor: '#1d3124' },
                }}
              />
              <TextField
                {...register('participantLimit', { required: 'Participant limit is required' })}
                label="Participant Limit"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.participantLimit}
                helperText={errors.participantLimit ? errors.participantLimit.message : ''}
                className="input-field participant-field"
                InputProps={{
                  style: { borderColor: '#1d3124' },
                }}
              />
            </Box>
            <Box className="event-category-container">
              <FormControl fullWidth variant="outlined" margin="normal" className="input-field event-field">
                <InputLabel>Event Type</InputLabel>
                <Select
                  {...register('eventType', { required: 'Event Type is required' })}
                  label="Event Type"
                  defaultValue=""
                  error={!!errors.eventType}
                  style={{ borderColor: '#1d3124' }}
                >
                  {Object.keys(eventTypes).map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
                {errors.eventType && <Typography color="error" className="error-message">{errors.eventType.message}</Typography>}
              </FormControl>
              {selectedEventType && (
                <FormControl fullWidth variant="outlined" margin="normal" className="input-field category-field">
                  <InputLabel>Category</InputLabel>
                  <Select
                    {...register('category', { required: 'Category is required' })}
                    label="Category"
                    defaultValue=""
                    error={!!errors.category}
                    style={{ borderColor: '#1d3124' }}
                  >
                    {eventTypes[selectedEventType].map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                  {errors.category && <Typography color="error" className="error-message">{errors.category.message}</Typography>}
                </FormControl>
              )}
            </Box>
            {errors.apiError && (
              <Typography color="error" variant="body2" className="error-message">
                {errors.apiError.message}
              </Typography>
            )}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              className="submit-button"
            >
              Create Event
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default EventCreation;
