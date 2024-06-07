import React from 'react';
import { useForm } from 'react-hook-form';
import { Typography, Container, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import './Login.css'; // Import the new CSS file

const LogIn = () => {
    const { dispatch } = useEvent();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        dispatch({ type: 'log_in', payload: data });
        navigate('/dashboard');
    };

    return (
        <Container maxWidth="sm" className="signup-login-container">
            <Typography variant="h4" className="title">Log In</Typography>
            <form className="signin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    className="signin-button"
                >
                    Log In
                </Button>
            </form>
            <Typography variant="body2" className="switch-auth">
                Don't have an account? <Link component={RouterLink} to="/signup">Sign Up</Link>
            </Typography>
        </Container>
    );
};

export default LogIn;
