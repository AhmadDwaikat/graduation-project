import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    bio: '',
    profilePicture: '',
  });
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newTitles, setNewTitles] = useState({}); // Manage new titles for each event

  useEffect(() => {
    fetchUserInfo();
    fetchUserEvents();
    fetchUserReviews();
  }, []);

  const fetchUserInfo = async () => {
    setFetchError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFetchError('No token found');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        setUser(response.data.data);
      } else {
        setFetchError('Failed to fetch user information');
      }
    } catch (err) {
      setFetchError('Error fetching user information');
    }
  };

  const fetchUserEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFetchError('No token found');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/events/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        setEvents(response.data.data);
      } else {
        setFetchError('Failed to fetch user events');
      }
    } catch (err) {
      setFetchError('Error fetching user events');
    }
  };

  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFetchError('No token found');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/reviews/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        setReviews(response.data.data);
      } else {
        setFetchError('Failed to fetch user reviews');
      }
    } catch (err) {
      setFetchError('Error fetching user reviews');
    }
  };

  const deleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEvents(events.filter(event => event._id !== id));
    } catch (err) {
      console.error('Error deleting event:', err.response ? err.response.data : err.message);
    }
  };

  const changeEvent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const updatedEvent = { title: newTitles[id] || 'Updated Title' };

      console.log('Sending update request for event ID:', id, 'with new title:', updatedEvent.title);

      const response = await axios.put(`http://localhost:5000/api/events/${id}`, updatedEvent, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Event updated response:', response.data);

      // Clear the input field after updating
      setNewTitles(prevState => ({
        ...prevState,
        [id]: ''
      }));

      // Refetch events to update the list
      fetchUserEvents();
    } catch (err) {
      console.error('Error updating event:', err.response ? err.response.data : err.message);
    }
  };

  const handleTitleChange = (id, value) => {
    setNewTitles(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    setUpdateError('');
    setSuccessMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUpdateError('No token found');
        return;
      }

      const response = await axios.put('http://localhost:5000/api/auth/me', user, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        setSuccessMessage('Profile updated successfully');
      } else {
        setUpdateError('Failed to update profile');
      }
    } catch (err) {
      setUpdateError('Error updating profile');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Profile</Typography>
      {fetchError && (
        <Typography color="error" variant="body2">
          {fetchError}
        </Typography>
      )}
      {updateError && (
        <Typography color="error" variant="body2">
          {updateError}
        </Typography>
      )}
      {successMessage && (
        <Typography color="primary" variant="body2">
          {successMessage}
        </Typography>
      )}
      <Avatar src={user.profilePicture} alt={user.name} style={{ width: 100, height: 100, marginBottom: 20 }} />
      <TextField
        name="name"
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={user.name}
        onChange={handleInputChange}
      />
      <TextField
        name="bio"
        label="Bio"
        variant="outlined"
        fullWidth
        margin="normal"
        value={user.bio}
        onChange={handleInputChange}
      />
      <TextField
        name="profilePicture"
        label="Profile Picture URL"
        variant="outlined"
        fullWidth
        margin="normal"
        value={user.profilePicture}
        onChange={handleInputChange}
      />
      <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginBottom: 20 }}>
        Update Profile
      </Button>

      <Typography variant="h5" gutterBottom>User Events</Typography>
      <List>
        {events.map(event => (
          <ListItem key={event._id} divider>
            <ListItemText 
              primary={event.title} 
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    {event.description}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2">
                    {new Date(event.date).toLocaleDateString()}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2">
                    {event.time}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2">
                    {event.location}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2">
                    {event.category}
                  </Typography>
                </>
              }
            />
            <Button onClick={() => deleteEvent(event._id)} variant="contained" color="secondary">
              Delete
            </Button>
            <TextField 
              label="New Title"
              value={newTitles[event._id] || ''}
              onChange={(e) => handleTitleChange(event._id, e.target.value)}
              variant="outlined"
              size="small"
              style={{ marginLeft: '10px' }}
            />
            <Button onClick={() => changeEvent(event._id)} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
              Change
            </Button>
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom>User Reviews</Typography>
      <List>
        {reviews.map(review => (
          <ListItem key={review._id} divider>
            <ListItemText
              primary={review.title}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    {review.comment}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2">
                    Rating: {review.rating}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Profile;
