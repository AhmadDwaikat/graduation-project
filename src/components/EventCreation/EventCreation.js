import React from 'react';
import { useForm } from 'react-hook-form';
import { Typography, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import './EventCreation.css';

const EventCreation = () => {
    const { dispatch } = useEvent();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

    const onSubmit = async (data) => {
        clearErrors(); // Clear any previous errors
        console.log('Submitting event creation form with data:', data);
        try {
            const response = await fetch('http://localhost:5000/api/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log('Response from server:', result);
            if (response.ok) {
                dispatch({ type: 'create_event', payload: result });
                navigate('/dashboard'); // Redirect to dashboard page
            } else {
                console.error(result.message);
                setError('apiError', { type: 'manual', message: result.message });
            }
        } catch (error) {
            console.error('Error creating event:', error);
            setError('apiError', { type: 'manual', message: 'An unexpected error occurred. Please try again later.' });
        }
    };

    return (
        <Container maxWidth="sm" className="create-event-container">
            <Typography variant="h4" className="title">Create Event</Typography>
            <form className="create-event-form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    {...register('title', { required: 'Title is required' })}
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.title}
                    helperText={errors.title ? errors.title.message : ''}
                />
                <TextField
                    {...register('description', { required: 'Description is required' })}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description ? errors.description.message : ''}
                />
                <TextField
                    {...register('date', { required: 'Date is required' })}
                    label="Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.date}
                    helperText={errors.date ? errors.date.message : ''}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    {...register('time', { required: 'Time is required' })}
                    label="Time"
                    type="time"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.time}
                    helperText={errors.time ? errors.time.message : ''}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    {...register('location', { required: 'Location is required' })}
                    label="Location"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.location}
                    helperText={errors.location ? errors.location.message : ''}
                />
                <TextField
                    {...register('participantLimit', { required: 'Participant limit is required' })}
                    label="Participant Limit"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.participantLimit}
                    helperText={errors.participantLimit ? errors.participantLimit.message : ''}
                />
                <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        {...register('category', { required: 'Category is required' })}
                        label="Category"
                        defaultValue=""
                        error={!!errors.category}
                    >
                        <MenuItem value="Sports">Sports</MenuItem>
                        <MenuItem value="Volunteering">Volunteering</MenuItem>
                        <MenuItem value="Music">Music</MenuItem>
                        <MenuItem value="Art">Art</MenuItem>
                        <MenuItem value="Education">Education</MenuItem>
                    </Select>
                    {errors.category && <Typography color="error">{errors.category.message}</Typography>}
                </FormControl>
                {errors.apiError && (
                    <Typography color="error" variant="body2">
                        {errors.apiError.message}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    className="create-event-button"
                >
                    Create Event
                </Button>
            </form>
        </Container>
    );
};

export default EventCreation;
