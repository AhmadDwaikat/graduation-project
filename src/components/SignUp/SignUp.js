import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { useEvent } from '../../context/EventContext';
import './SignUp.css';

// Updated interests list with emoji icons and names to match the provided image and extended interests
const interestsList = [
  { name: "Soccer", icon: "⚽" },
  { name: "Basketball", icon: "🏀" },
  { name: "Tennis", icon: "🎾" },
  { name: "Running", icon: "🏃" },
  { name: "Yoga", icon: "🧘" },
  { name: "Swimming", icon: "🏊" },
  { name: "Cycling", icon: "🚴" },
  { name: "Hiking", icon: "🥾" },
  { name: "Martial Arts", icon: "🥋" },
  { name: "Golf", icon: "⛳" },
  { name: "Concerts", icon: "🎤" },
  { name: "Music Festivals", icon: "🎉" },
  { name: "Open Mic Nights", icon: "🎙️" },
  { name: "Classical Music", icon: "🎻" },
  { name: "Jazz", icon: "🎷" },
  { name: "Rock", icon: "🎸" },
  { name: "Pop", icon: "🎧" },
  { name: "EDM", icon: "🎛️" },
  { name: "Hip-Hop", icon: "🎤" },
  { name: "Karaoke", icon: "🎤" },
  { name: "Art Exhibitions", icon: "🖼️" },
  { name: "Theater Performances", icon: "🎭" },
  { name: "Museums", icon: "🏛️" },
  { name: "Literature and Book Clubs", icon: "📚" },
  { name: "Poetry Readings", icon: "📖" },
  { name: "Dance Performances", icon: "💃" },
  { name: "Cultural Festivals", icon: "🎊" },
  { name: "Photography", icon: "📸" },
  { name: "Craft Workshops", icon: "🧶" },
  { name: "Historical Tours", icon: "🏰" },
  { name: "Tech Conferences", icon: "💻" },
  { name: "Coding Bootcamps", icon: "👨‍💻" },
  { name: "Hackathons", icon: "💡" },
  { name: "Start-up Meetups", icon: "🚀" },
  { name: "Gadget Expos", icon: "🔧" },
  { name: "Robotics", icon: "🤖" },
  { name: "AI and Machine Learning", icon: "🤖" },
  { name: "Virtual Reality", icon: "🕶️" },
  { name: "Game Development", icon: "🎮" },
  { name: "Blockchain and Cryptocurrency", icon: "💰" },
  { name: "Food Festivals", icon: "🍔" },
  { name: "Wine Tasting", icon: "🍷" },
  { name: "Cooking Classes", icon: "🍳" },
  { name: "Restaurant Openings", icon: "🍽️" },
  { name: "Brewery Tours", icon: "🍺" },
  { name: "Street Food", icon: "🌯" },
  { name: "Vegan and Vegetarian Events", icon: "🥗" },
  { name: "Coffee Tastings", icon: "☕" },
  { name: "Baking Workshops", icon: "🍰" },
  { name: "Cocktail Mixing", icon: "🍸" },
  { name: "Fitness Classes", icon: "🏋️" },
  { name: "Meditation", icon: "🧘" },
  { name: "Mental Health Workshops", icon: "🧠" },
  { name: "Nutrition Seminars", icon: "🥦" },
  { name: "Wellness Retreats", icon: "🌿" },
  { name: "Spa Days", icon: "💆" },
  { name: "Holistic Healing", icon: "👐" },
  { name: "Running Clubs", icon: "🏃" },
  { name: "Health Fairs", icon: "🏥" },
  { name: "Personal Development", icon: "📈" },
  { name: "Camping", icon: "🏕️" },
  { name: "Rock Climbing", icon: "🧗" },
  { name: "Scuba Diving", icon: "🤿" },
  { name: "Skiing and Snowboarding", icon: "⛷️" },
  { name: "Surfing", icon: "🏄" },
  { name: "Wildlife Tours", icon: "🦁" },
  { name: "Kayaking", icon: "🛶" },
  { name: "Paragliding", icon: "🪂" },
  { name: "Fishing", icon: "🎣" },
  { name: "Eco-Tours", icon: "🌍" },
  { name: "Charity Events", icon: "❤️" },
  { name: "Community Clean-ups", icon: "🧹" },
  { name: "Fundraisers", icon: "💵" },
  { name: "Blood Drives", icon: "🩸" },
  { name: "Animal Shelter Volunteering", icon: "🐾" },
  { name: "Senior Care", icon: "👴" },
  { name: "Environmental Conservation", icon: "🌳" },
  { name: "Homeless Shelters", icon: "🏠" },
  { name: "Tutoring and Mentoring", icon: "🎓" },
  { name: "Political Activism", icon: "📢" },
  { name: "Language Classes", icon: "🗣️" },
  { name: "Public Lectures", icon: "🎤" },
  { name: "Science Fairs", icon: "🔬" },
  { name: "Book Readings", icon: "📖" },
  { name: "History Talks", icon: "🏺" },
  { name: "Skill-Building Workshops", icon: "🛠️" },
  { name: "Online Courses", icon: "💻" },
  { name: "Educational Tours", icon: "🎓" },
  { name: "Art Classes", icon: "🎨" },
  { name: "Professional Development", icon: "💼" },
  { name: "Esports Tournaments", icon: "🎮" },
  { name: "Board Game Nights", icon: "🎲" },
  { name: "RPG Sessions", icon: "⚔️" },
  { name: "Card Game Tournaments", icon: "🃏" },
  { name: "Video Game Meetups", icon: "🎮" },
  { name: "Cosplay Events", icon: "👗" },
  { name: "Game Development Workshops", icon: "👨‍💻" },
  { name: "Puzzle Hunts", icon: "🧩" },
  { name: "Arcade Nights", icon: "🕹️" },
  { name: "Fantasy Sports", icon: "🏈" }
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
          <Typography variant="body2" className="selected-counter">
            {selectedInterests.length} / 20 selected
          </Typography>
          <Box className="interests-list">
            {interestsList.map((interest) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedInterests.includes(interest.name)}
                    onChange={handleInterestChange}
                    name={interest.name}
                  />
                }
                label={<span>{interest.icon} {interest.name}</span>}
                key={interest.name}
                className="interest-item"
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
