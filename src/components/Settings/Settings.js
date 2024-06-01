import React from 'react';
import { Typography, Card, CardContent, FormControl, InputLabel, Input, Button } from '@mui/material';
import './Settings.css';
import eventData from '../data.json'; // Import the temporary data

const Settings = () => {
    const { email } = eventData.settings;

    return (
        <div className="settings-container">
            <Typography variant="h4" className="title">
                Settings
            </Typography>
            <Card className="account-settings-card">
                <CardContent>
                    <Typography variant="h6" className="section-title">
                        Account Settings
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Email</InputLabel>
                        <Input type="email" defaultValue={email} />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Password</InputLabel>
                        <Input type="password" />
                    </FormControl>
                    <Button variant="contained" color="primary" className="save-button">
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
            <Card className="notification-settings-card">
                <CardContent>
                    <Typography variant="h6" className="section-title">
                        Notification Preferences
                    </Typography>
                    {/* Notification preferences options */}
                </CardContent>
            </Card>
            <Card className="privacy-settings-card">
                <CardContent>
                    <Typography variant="h6" className="section-title">
                        Privacy Settings
                    </Typography>
                    {/* Privacy settings options */}
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;
