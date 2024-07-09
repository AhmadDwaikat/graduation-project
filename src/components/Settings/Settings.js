import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Typography, Card, CardContent, TextField, Button, Container, Paper, Alert } from '@mui/material';
import './Settings.css';

const Settings = () => {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch user data if needed for other parts of the settings
  }, []);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setServerError('New password and confirm password do not match');
      return;
    }
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
        console.error('Error changing password:', result);
        setServerError(result.message || 'Failed to change password');
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
      <Paper elevation={3} className="settings-paper">
        <Typography variant="h4" className="title">
          Settings
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
          {serverError && <Alert severity="error" className="alert-message">{serverError}</Alert>}
          {successMessage && <Alert severity="success" className="alert-message">{successMessage}</Alert>}
          <PasswordSettingsCard register={register} errors={errors} watch={watch} />
          <NotificationSettingsCard />
          <PrivacySettingsCard />
        </form>
      </Paper>
    </Container>
  );
};

const PasswordSettingsCard = ({ register, errors, watch }) => (
  <Card className="settings-card">
    <CardContent>
      <Typography variant="h6" className="section-title" align="center">
        Change Password
      </Typography>
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
      <TextField
        {...register('confirmPassword', {
          required: 'Confirm password is required',
          validate: value =>
            value === watch('newPassword') || 'Passwords do not match'
        })}
        label="Confirm New Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
        aria-invalid={!!errors.confirmPassword}
        aria-describedby="confirm-password-error"
      />
      <Button variant="contained" color="primary" type="submit" className="save-button">
        Save Changes
      </Button>
    </CardContent>
  </Card>
);

const NotificationSettingsCard = () => (
  <Card className="settings-card">
    <CardContent>
      <Typography variant="h6" className="section-title">
        Notification Preferences
      </Typography>
      {/* Notification preferences options */}
    </CardContent>
  </Card>
);

const PrivacySettingsCard = () => (
  <Card className="settings-card">
    <CardContent>
      <Typography variant="h6" className="section-title">
        Privacy Settings
      </Typography>
      {/* Privacy settings options */}
    </CardContent>
  </Card>
);

export default Settings;
