import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Typography, TextField, Avatar, List, ListItem, Button, Card, CardContent } from '@mui/material';

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
  const [profileImage, setProfileImage] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setProfileImage(files[0]);
    } else {
      setUser(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
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

      let profilePictureUrl = user.profilePicture;
      if (profileImage) {
        const formData = new FormData();
        formData.append('file', profileImage);

        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        if (uploadResponse.data && uploadResponse.data.success) {
          profilePictureUrl = uploadResponse.data.url;
        } else {
          setUpdateError('Failed to upload profile picture');
          return;
        }
      }

      const updatedUser = { ...user, profilePicture: profilePictureUrl };

      const response = await axios.put('http://localhost:5000/api/auth/me', updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        setSuccessMessage('Profile updated successfully');
        setUser(updatedUser);
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
      <Avatar src={user.profilePicture} alt={user.name} style={{ width: 200, height: 200, marginBottom: 20 }} />
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
      <input
        accept="image/*"
        type="file"
        name="profilePicture"
        onChange={handleInputChange}
        style={{ marginBottom: 20 }}
      />
      <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginBottom: 20 }}>
        Update Profile
      </Button>

      <Typography variant="h5" gutterBottom>User Events</Typography>
      <List>
        {events.map(event => (
          <ListItem key={event._id} divider>
            <Card style={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  <Link to={`/events/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {event.title}
                  </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time: {event.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {event.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {event.category}
                </Typography>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom>User Reviews</Typography>
      <List>
        {reviews.map(review => (
          <ListItem key={review._id} divider>
            <Card style={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {review.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {review.comment}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {review.rating}
                </Typography>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Profile;
