import React, { useState } from 'react';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './EventCreation.css';
import eventData from '../data.json'; // Import the temporary data

const EventCreation = () => {
    const [eventTitle, setEventTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [participantLimit, setParticipantLimit] = useState('');
    const [category, setCategory] = useState('');

    const handleCreateEvent = () => {
        const newEvent = {
            id: eventData.createdEvents.length + 1,
            title: eventTitle,
            description,
            location,
            date,
            time,
            participantLimit,
            category
        };

        const updatedEventData = {
            ...eventData,
            createdEvents: [...eventData.createdEvents, newEvent]
        };

        // Update the data.json file with the new event
        // This is a simplified example, in a real application you would use a backend API
        // or another method to persist the data
        console.log(updatedEventData);

        // Clear the form fields after creating the event
        setEventTitle('');
        setDescription('');
        setLocation('');
        setDate('');
        setTime('');
        setParticipantLimit('');
        setCategory('');
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
                />
                <TextField
                    required
                    label="Location"
                    fullWidth
                    variant="outlined"
                    className="form-field"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
                />
                <FormControl fullWidth variant="outlined" className="form-field">
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
