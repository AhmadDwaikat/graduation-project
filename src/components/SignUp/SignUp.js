import React from 'react';
import { useForm } from 'react-hook-form';
import { Typography, Container, TextField, Button, Link, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import './SignUp.css';

const SignUp = () => {
    const { dispatch } = useEvent();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

    const onSubmit = async (data) => {
        clearErrors(); // Clear any previous errors
        console.log('Submitting sign-up form with data:', data);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', { // Ensure this URL matches your backend route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log('Response from server:', result);
            if (response.ok) {
                dispatch({ type: 'login', payload: result });
                navigate('/login');
            } else {
                if (result.errors) {
                    result.errors.forEach(error => {
                        setError(error.param, { type: 'manual', message: error.msg });
                    });
                } else {
                    console.error(result.message);
                    setError('apiError', { type: 'manual', message: result.message });
                }
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setError('apiError', { type: 'manual', message: 'An unexpected error occurred. Please try again later.' });
        }
    };

    return (
        <Container maxWidth="sm" className="signup-login-container">
            <Box className="signup-container">
                <Typography variant="h4" className="title">Sign Up</Typography>
                <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        {...register('name', { required: 'Name is required' })}
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.name}
                        helperText={errors.name ? errors.name.message : ''}
                        className="input-field"
                    />
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
                        className="input-field"
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
                        className="input-field"
                    />
                    {errors.apiError && (
                        <Typography color="error" variant="body2" className="error-message">
                            {errors.apiError.message}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        className="signup-button"
                    >
                        Sign Up
                    </Button>
                </form>
                <Typography variant="body2" className="switch-auth">
                    Already have an account? <Link href="/login">Login</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default SignUp;
