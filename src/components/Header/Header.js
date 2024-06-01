import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import eventData from '../data.json'; // Import the temporary data

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform the logout action here
        eventData.authentication.isLoggedIn = false;
        navigate('/login'); // Redirect to the login page after logout
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">Social Activity App</Typography>
                <Button color="inherit" component={RouterLink} to="/">Home</Button>
                <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
                <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
                
                {eventData.authentication.isLoggedIn && (
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
