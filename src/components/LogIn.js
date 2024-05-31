// SignIn.js
import React from 'react';
import { Typography, Container, TextField, Button} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import './SignUpLogin.css';
import eventData from './data.json'; // Import the temporary data

const SignIn = () => {
    const navigate = useNavigate();

    const handleSignIn = () => {
        // Here you would handle your sign in logic (authentication)
        // For now, we'll just navigate to the Dashboard page
        eventData.authentication.isLoggedIn = true;
        navigate('/dashboard');
    };

    return (
        <Container maxWidth="sm" className="signup-login-container">
            <Typography variant="h4" className="title">
                Sign In
            </Typography>
            <form className="signin-form">
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSignIn}
                    className="signin-button"
                >
                    Sign In
                </Button>
            </form>
            <Typography variant="body2" className="switch-auth">
                Don't have an account? <RouterLink to="/signup">Sign Up</RouterLink>
            </Typography>
        </Container>
    );
};

export default SignIn;
