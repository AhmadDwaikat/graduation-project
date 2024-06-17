import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Typography, Card, CardContent, TextField, Button, Container, Paper, Alert } from '@mui/material';
import { useEvent } from '../../context/EventContext';
import './Settings.css';

const Settings = () => {
  const { state, dispatch } = useEvent();
  const { email } = state.settings;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: email,
      currentPassword: '',
      newPassword: '',
    }
  });

  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (data) => {
    console.log('Settings Data:', data);

    // Update settings
    dispatch({ type: 'update_settings', payload: data });

    // Change password
    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Password updated successfully');
        setServerError('');
      } else {
        setServerError(result.message);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error changing password:', error.message);
      setServerError('An unexpected error occurred. Please try again later.');
      setSuccessMessage('');
    }
  };

  return (
    <Container maxWidth="lg" className="settings-container">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h4" className="title">
          Settings
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
          {serverError && <Alert severity="error" style={{ marginBottom: '20px' }}>{serverError}</Alert>}
          {successMessage && <Alert severity="success" style={{ marginBottom: '20px' }}>{successMessage}</Alert>}
          <AccountSettingsCard register={register} errors={errors} />
          <NotificationSettingsCard />
          <PrivacySettingsCard />
        </form>
      </Paper>
    </Container>
  );
};

const AccountSettingsCard = ({ register, errors }) => (
  <Card className="account-settings-card">
    <CardContent>
      <Typography variant="h6" className="section-title">
        Account Settings
      </Typography>
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
        aria-invalid={!!errors.email}
        aria-describedby="email-error"
      />
      <TextField
        {...register('currentPassword', {
          required: 'Current password is required',
          minLength: { value: 6, message: 'Password must be at least 6 characters' }
        })}
        label="Current Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.currentPassword}
        helperText={errors.currentPassword ? errors.currentPassword.message : ''}
        aria-invalid={!!errors.currentPassword}
        aria-describedby="current-password-error"
      />
      <TextField
        {...register('newPassword', {
          required: 'New password is required',
          minLength: { value: 6, message: 'Password must be at least 6 characters' }
        })}
        label="New Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.newPassword}
        helperText={errors.newPassword ? errors.newPassword.message : ''}
        aria-invalid={!!errors.newPassword}
        aria-describedby="new-password-error"
      />
      <Button variant="contained" color="primary" type="submit" className="save-button">
        Save Changes
      </Button>
    </CardContent>
  </Card>
);

const NotificationSettingsCard = () => (
  <Card className="notification-settings-card">
    <CardContent>
      <Typography variant="h6" className="section-title">
        Notification Preferences
      </Typography>
      {/* Notification preferences options */}
    </CardContent>
  </Card>
);

const PrivacySettingsCard = () => (
  <Card className="privacy-settings-card">
    <CardContent>
      <Typography variant="h6" className="section-title">
        Privacy Settings
      </Typography>
      {/* Privacy settings options */}
    </CardContent>
  </Card>
);

export default Settings;
