import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button } from '@mui/material';
import './UpdateEvent.css';

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    category: '',
    location: '',
    participantLimit: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data && response.data.success) {
          setEvent(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching event details:', error.message);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/events/${id}`,
        event,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data && response.data.success) {
        navigate(`/event-organizer/${id}`);
      }
    } catch (error) {
      console.error('Error updating event:', error.message);
    }
  };

  return (
    <Container maxWidth="lg" className="update-event-container">
      <Typography variant="h4" className="title" gutterBottom>
        Update Event
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          name="title"
          value={event.title}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          name="description"
          value={event.description}
          onChange={handleChange}
        />
        <TextField
          label="Date"
          variant="outlined"
          fullWidth
          margin="normal"
          name="date"
          type="date"
          value={event.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Time"
          variant="outlined"
          fullWidth
          margin="normal"
          name="time"
          type="time"
          value={event.time}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Category"
          variant="outlined"
          fullWidth
          margin="normal"
          name="category"
          value={event.category}
          onChange={handleChange}
        />
        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          margin="normal"
          name="location"
          value={event.location}
          onChange={handleChange}
        />
        <TextField
          label="Participant Limit"
          variant="outlined"
          fullWidth
          margin="normal"
          name="participantLimit"
          type="number"
          value={event.participantLimit}
          onChange={handleChange}
        />
        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          style={{ marginTop: '20px' }}>
          Update Event
        </Button>
      </form>
    </Container>
  );
};

export default UpdateEvent;
