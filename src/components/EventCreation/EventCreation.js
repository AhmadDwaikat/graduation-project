import React, { useState } from 'react';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEvent } from '../../context/EventContext';
import './EventCreation.css';

const EventCreation = () => {
    const { state, dispatch } = useEvent();
    const [eventTitle, setEventTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [participantLimit, setParticipantLimit] = useState('');
    const [category, setCategory] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!eventTitle) newErrors.eventTitle = 'Event title is required';
        if (!description) newErrors.description = 'Description is required';
        if (!location) newErrors.location = 'Location is required';
        if (!date) newErrors.date = 'Date is required';
        if (!time) newErrors.time = 'Time is required';
        if (!participantLimit) newErrors.participantLimit = 'Participant limit is required';
        if (!category) newErrors.category = 'Category is required';
        return newErrors;
    };

    const handleCreateEvent = () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const newEvent = {
            id: state.createdEvents.length + 1,
            title: eventTitle,
            description,
            location,
            date,
            time,
            participantLimit,
            category
        };

        dispatch({ type: 'create_event', payload: newEvent });

        // Clear the form fields after creating the event
        setEventTitle('');
        setDescription('');
        setLocation('');
        setDate('');
        setTime('');
        setParticipantLimit('');
        setCategory('');
        setErrors({});
    };

    return (
        <div className="event-creation-container">
            <Typography variant="h4" className="title">
                Create New Event
            </Typography>
            <form className="event-form" autoComplete="off">
                <TextField
                    required
                    label="Event Title"
                    fullWidth
                    variant="outlined"
                    className="form-field"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    error={!!errors.eventTitle}
                    helperText={errors.eventTitle}
                />
                <TextField
                    required
                    label="Description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    className="form-field"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                />
                <TextField
                    required
                    label="Location"
                    fullWidth
                    variant="outlined"
                    className="form-field"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    error={!!errors.location}
                    helperText={errors.location}
                />
                <TextField
                    required
                    label="Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    className="form-field"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    error={!!errors.date}
                    helperText={errors.date}
                />
                <TextField
                    required
                    label="Time"
                    type="time"
                    fullWidth
                    variant="outlined"
                    className="form-field"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    error={!!errors.time}
                    helperText={errors.time}
                />
                <TextField
                    required
                    label="Participant Limit"
                    type="number"
                    fullWidth
                    variant="outlined"
                    className="form-field"
                    value={participantLimit}
                    onChange={(e) => setParticipantLimit(e.target.value)}
                    error={!!errors.participantLimit}
                    helperText={errors.participantLimit}
                />
                <FormControl fullWidth variant="outlined" className="form-field" error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <MenuItem value="category1">Category 1</MenuItem>
                        <MenuItem value="category2">Category 2</MenuItem>
                        <MenuItem value="category3">Category 3</MenuItem>
                    </Select>
                    {errors.category && <Typography color="error">{errors.category}</Typography>}
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    className="submit-button"
                    onClick={handleCreateEvent}
                >
                    Create Event
                </Button>
            </form>
        </div>
    );
};

export default EventCreation;
