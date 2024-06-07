import React from 'react';
import { useForm } from 'react-hook-form';
import { Typography, Card, CardContent, TextField, Button, Container, Paper } from '@mui/material';
import { useEvent } from '../../context/EventContext';
import './Settings.css';

const Settings = () => {
    const { state, dispatch } = useEvent();
    const { email } = state.settings;

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: email,
            password: '',
        }
    });

    const onSubmit = (data) => {
        console.log('Settings Data:', data);
        dispatch({ type: 'update_settings', payload: data });
    };

    return (
        <Container maxWidth="lg" className="settings-container">
            <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
                <Typography variant="h4" className="title">
                    Settings
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
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
                {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
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
