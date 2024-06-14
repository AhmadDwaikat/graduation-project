import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';

const Header = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useEvent();

    const handleLogout = () => {
        dispatch({ type: 'logout' });
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Social Activity App
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button color="inherit" component={RouterLink} to="/">Home</Button>
                    <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
                    <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
                    <Button color="inherit" component={RouterLink} to="/settings">Settings</Button>
                    <Button color="inherit" component={RouterLink} to="/event-creation">Create Event</Button>
                    <Button color="inherit" component={RouterLink} to="/activity-library">Activity Library</Button>
                    <Button color="inherit" component={RouterLink} to="/notifications">Notifications</Button>
                    <Button color="inherit" component={RouterLink} to="/messages">Messages</Button>
                    <Button color="inherit" component={RouterLink} to="/analytics">Analytics</Button>
                    
                    {!state.isAuthenticated && (
                        <>
                            <Button color="inherit" component={RouterLink} to="/signup">Sign Up</Button>
                            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                        </>
                    )}
                    {state.isAuthenticated && (
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
