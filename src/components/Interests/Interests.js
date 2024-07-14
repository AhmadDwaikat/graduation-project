import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import './Interests.css';
import { useEvent } from '../../context/EventContext';

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
  { name: "Fantasy Sports", icon: "🏈" },
  { name: "Hands-on Learning", icon: "👐" },
  { name: "Skill Development", icon: "🛠️" },
  { name: "Interactive Sessions", icon: "🗣️" },
  { name: "Small Group Classes", icon: "👥" },
  { name: "Networking Events", icon: "🔗" },
  { name: "Meet and Greets", icon: "🤝" },
  { name: "Parties", icon: "🎉" },
  { name: "Social Mixers", icon: "🍹" },
  { name: "Picnics", icon: "🍉" },
  { name: "Nature Walks", icon: "🚶" },
  { name: "Sports Games", icon: "⚽" },
  { name: "Adventure Trips", icon: "🚵" },
  { name: "Live Music", icon: "🎵" },
  { name: "Theater Shows", icon: "🎭" },
  { name: "Dance Performances", icon: "💃" },
  { name: "Comedy Shows", icon: "😂" },
  { name: "Art Shows", icon: "🖼️" },
  { name: "Trade Shows", icon: "🏷️" },
  { name: "Science Exhibitions", icon: "🔬" },
  { name: "Auto Shows", icon: "🚗" },
  { name: "Industry Conferences", icon: "🏢" },
  { name: "Academic Conferences", icon: "🎓" },
  { name: "Tech Summits", icon: "💻" },
  { name: "Business Forums", icon: "💼" },
  { name: "Educational Lectures", icon: "📖" },
  { name: "Fitness Classes", icon: "🏋️" },
  { name: "Cooking Classes", icon: "🍳" },
  { name: "Language Lessons", icon: "🗣️" },
  { name: "Film Festivals", icon: "🎬" },
  { name: "Charity Work", icon: "❤️" },
  { name: "Community Service", icon: "🧹" },
  { name: "Environmental Clean-ups", icon: "🌳" },
  { name: "Fundraising Events", icon: "💵" },
  { name: "Sports Tournaments", icon: "🏆" },
  { name: "Talent Shows", icon: "🎤" },
  { name: "Hackathons", icon: "💡" },
  { name: "Quiz Competitions", icon: "❓" }
];

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();
  const { state: { user } } = useEvent();

  useEffect(() => {
    setSelectedInterests(user?.interests || [])
  }, [user])

  const handleInterestChange = (interest) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest.name)) {
        return prev.filter((i) => i !== interest.name);
      } else {
        return [...prev, interest.name];
      }
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        'http://localhost:5000/api/auth/update-interests',
        { interests: selectedInterests },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        navigate('/profile'); 
      }
    } catch (error) {
      console.error('Error updating interests:', error.message);
    }
  };

  return (
    <Container className="interests-container">
      <Typography variant="h4" className="interests-title">Let's select your interests.</Typography>
      <Typography variant="body1" className="interests-subtitle">Please select two or more to proceed.</Typography>
      <Box className="interests-list">
        {interestsList.map((interest) => (
          <FormControlLabel
            key={interest.name}
            control={
              <Checkbox
                checked={selectedInterests.includes(interest.name)}
                onChange={() => handleInterestChange(interest)}
                className="interest-checkbox"
              />
            }
            label={<span>{interest.icon} {interest.name}</span>}
            className={`interest-item ${selectedInterests.includes(interest.name) ? 'selected' : ''}`}
          />
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className="continue-button"
        disabled={selectedInterests.length < 2}
      >
        Continue
      </Button>
    </Container>
  );
};

export default Interests;
