import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import './Login.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setApiError(''); // Clear previous errors
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        navigate('/dashboard'); // Redirect to dashboard or any protected route
      } else {
        setApiError(result.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setApiError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <Container maxWidth="sm" className="signup-login-container">
      <Box className="login-container">
        <Typography variant="h4" className="title">Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="signin-form">
          <TextField
            {...register('email', { 
              required: 'Email is required', 
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
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
              required: 'Password is required' 
            })}
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
            className="input-field"
          />
          {apiError && (
            <Typography color="error" variant="body2" className="error-message">
              {apiError}
            </Typography>
          )}
          <Button variant="contained" color="primary" type="submit" fullWidth className="signin-button">
            Login
          </Button>
        </form>
        <Typography variant="body2" className="switch-auth">
          Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;