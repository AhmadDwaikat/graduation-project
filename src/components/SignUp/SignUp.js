import React from 'react';
import { useForm } from 'react-hook-form';
import { Typography, Container, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import './SignUp.css'; // Import the new CSS file

const SignUp = () => {
    const { dispatch } = useEvent();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        dispatch({ type: 'sign_up', payload: data });
        navigate('/dashboard');
    };

    return (
        <Container maxWidth="sm" className="signup-login-container">
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
                />
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
                Already have an account? <a href="/login">Login</a>
            </Typography>
        </Container>
    );
};

export default SignUp;
