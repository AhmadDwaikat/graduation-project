import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Avatar, Card, Button, MenuItem } from '@mui/material';
import { useEvent } from '../../context/EventContext';
import './Profile.css';

const Profile = () => {
  const { state, dispatch } = useEvent();
  const { user } = state;
  const [fetchError, setFetchError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const fetchUserInfo = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFetchError('No token found');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        dispatch({ type: 'set_user', payload: response.data.data });
      } else {
        setFetchError('Failed to fetch user information');
      }
    } catch (err) {
      setFetchError('Error fetching user information');
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setProfileImage(files[0]);
    } else {
      dispatch({
        type: 'set_user',
        payload: {
          ...user,
          [name]: value,
        },
      });
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
            Authorization: `Bearer ${token}`,
          },
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
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        setSuccessMessage('Profile updated successfully');
        dispatch({ type: 'set_user', payload: updatedUser });
      } else {
        setUpdateError('Failed to update profile');
      }
    } catch (err) {
      setUpdateError('Error updating profile: ' + err.message);
    }
  };

  const handleUpdateInterests = () => {
    // Navigate to the interests update page
    // Ensure to set up the route for interests page in your application
    window.location.href = '/interests';
  };

  return (
    <Container maxWidth="md" className="profile-container">
      <Card className="profile-card">
        <Avatar src={user?.profilePicture} alt={user?.name} className="profile-avatar" />
        <Typography variant="h5" className="profile-name">{user?.name}</Typography>
        <Typography variant="body2" className="profile-email">{user?.email}</Typography>
        <Typography variant="body1" className="profile-bio">{user?.bio}</Typography>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user?.name || ''}
          onChange={handleInputChange}
          className="profile-edit-field"
        />
        <TextField
          name="bio"
          label="Bio"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user?.bio || ''}
          onChange={handleInputChange}
          className="profile-edit-field"
        />
        <TextField
          name="gender"
          label="Gender"
          variant="outlined"
          fullWidth
          margin="normal"
          select
          value={user?.gender || ''}
          onChange={handleInputChange}
          className="profile-edit-field"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField
          name="age"
          label="Age"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={user?.age || ''}
          onChange={handleInputChange}
          className="profile-edit-field"
        />
        <TextField
          name="location"
          label="Location"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user?.location || ''}
          onChange={handleInputChange}
          className="profile-edit-field"
        />
        <input
          accept="image/*"
          type="file"
          name="profilePicture"
          onChange={handleInputChange}
          style={{ marginBottom: 20 }}
        />
        <Button variant="contained" color="primary" onClick={handleUpdate} className="save-button">
          Update Profile
        </Button>
        <Button variant="contained" color="secondary" onClick={handleUpdateInterests} className="interests-button">
          Update Interests
        </Button>
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
      </Card>
    </Container>
  );
};

export default Profile;
