import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { useEvent } from '../../context/EventContext';
import './SignUp.css';

const interestsList = [
  "Soccer", "Basketball", "Tennis", "Running", "Yoga", "Swimming", "Cycling", "Hiking", "Martial Arts", "Golf",
  "Concerts", "Music Festivals", "Open Mic Nights", "Classical Music", "Jazz", "Rock", "Pop", "EDM", "Hip-Hop", "Karaoke",
  "Art Exhibitions", "Theater Performances", "Museums", "Literature and Book Clubs", "Poetry Readings", "Dance Performances",
  "Cultural Festivals", "Photography", "Craft Workshops", "Historical Tours", "Tech Conferences", "Coding Bootcamps",
  "Hackathons", "Start-up Meetups", "Gadget Expos", "Robotics", "AI and Machine Learning", "Virtual Reality",
  "Game Development", "Blockchain and Cryptocurrency", "Food Festivals", "Wine Tasting", "Cooking Classes",
  "Restaurant Openings", "Brewery Tours", "Street Food", "Vegan and Vegetarian Events", "Coffee Tastings", "Baking Workshops",
  "Cocktail Mixing", "Fitness Classes", "Meditation", "Mental Health Workshops", "Nutrition Seminars", "Wellness Retreats",
  "Spa Days", "Holistic Healing", "Running Clubs", "Health Fairs", "Personal Development", "Camping", "Rock Climbing",
  "Scuba Diving", "Skiing and Snowboarding", "Surfing", "Wildlife Tours", "Kayaking", "Paragliding", "Fishing", "Eco-Tours",
  "Charity Events", "Community Clean-ups", "Fundraisers", "Blood Drives", "Animal Shelter Volunteering", "Senior Care",
  "Environmental Conservation", "Homeless Shelters", "Tutoring and Mentoring", "Political Activism", "Language Classes",
  "Public Lectures", "Science Fairs", "Book Readings", "History Talks", "Skill-Building Workshops", "Online Courses",
  "Educational Tours", "Art Classes", "Professional Development", "Esports Tournaments", "Board Game Nights", "RPG Sessions",
  "Card Game Tournaments", "Video Game Meetups", "Cosplay Events", "Game Development Workshops", "Puzzle Hunts",
  "Arcade Nights", "Fantasy Sports"

];

const SignUp = () => {
  const { dispatch } = useEvent();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
  const [selectedInterests, setSelectedInterests] = React.useState([]);

  const handleInterestChange = (event) => {
    const interest = event.target.name;
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const onSubmit = async (data) => {
    if (selectedInterests.length < 20) {
      setError('interests', { type: 'manual', message: 'Please select at least 20 interests' });
      return;
    }

    clearErrors();
    console.log('Submitting sign-up form with data:', data);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, interests: selectedInterests }),
      });
      const result = await response.json();
      console.log('Response from server:', result);
      if (response.ok) {
        dispatch({ type: 'login', payload: result });
        navigate('/login');
      } else {
        if (result.errors) {
          result.errors.forEach((error) => {
            setError(error.param, { type: 'manual', message: error.msg });
          });
        } else {
          console.error(result.message);
          setError('apiError', { type: 'manual', message: result.message });
        }
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('apiError', { type: 'manual', message: 'An unexpected error occurred. Please try again later.' });
    }
  };

  return (
    <Container maxWidth="sm" className="signup-login-container">
      <Box className="signup-container">
        <Typography variant="h4" className="title">Sign Up</Typography>
        <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('name', { required: 'Name is required' })}
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
            className="input-field"
          />
          <TextField
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Invalid email address' }
            })}
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            className="input-field"
          />
          <TextField
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
            className="input-field"
          />
          <Typography variant="body1" className="interest-instruction">
            Select at least 20 interests:
          </Typography>
          <Box className="interests-list">
            {interestsList.map((interest) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedInterests.includes(interest)}
                    onChange={handleInterestChange}
                    name={interest}
                  />
                }
                label={interest}
                key={interest}
              />
            ))}
          </Box>
          {errors.interests && (
            <Typography color="error" variant="body2" className="error-message">
              {errors.interests.message}
            </Typography>
          )}
          {errors.apiError && (
            <Typography color="error" variant="body2" className="error-message">
              {errors.apiError.message}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            className="signup-button"
          >
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" className="switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUp;
