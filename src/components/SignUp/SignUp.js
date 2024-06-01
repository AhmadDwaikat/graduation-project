import React from 'react';
import { Typography, Container, TextField, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import '../SignUpLogin.css';

const SignUp = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleSignUp = () => {
        // Here you would handle your sign-up logic
        // For now, we'll just navigate to the Dashboard page
        navigate('/dashboard');
    };

    return (
        <Container maxWidth="sm" className="signup-login-container">
            <Typography variant="h4" className="title">
                Sign Up
            </Typography>
            <form className="signup-form">
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
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
                    onClick={handleSignUp}
                    className="signup-button"
                >
                    Sign Up
                </Button>
            </form>
            <Typography variant="body2" className="switch-auth">
                Already have an account? <a href="/login">Login</a>
            </Typography>
        </Container>
    );
};

export default SignUp;
