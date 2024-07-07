import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import UserEventsHeader from './UserEventsHeader';
import './UserEvents.css';

const UserEvents = () => {
  const [createdUpcomingEvents, setCreatedUpcomingEvents] = useState([]);
  const [createdPastEvents, setCreatedPastEvents] = useState([]);
  const [fetchError, setFetchError] = useState('');

  const fetchUserCreatedEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFetchError('No token found');
        return;
      }

      const [upcomingResponse, pastResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/events/user/created/upcoming', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/events/user/created/past', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (upcomingResponse.data.success && pastResponse.data.success) {
        setCreatedUpcomingEvents(upcomingResponse.data.data);
        setCreatedPastEvents(pastResponse.data.data);
      } else {
        setFetchError('Failed to fetch user events');
      }
    } catch (err) {
      setFetchError('Error fetching user events: ' + err.message);
    }
  }, []);

  useEffect(() => {
    fetchUserCreatedEvents();
  }, [fetchUserCreatedEvents]);

  return (
    <>
      <UserEventsHeader />
      <Container maxWidth="md" className="user-events-container">
        <Typography variant="h4" className="title">My Events</Typography>
        {fetchError && (
          <Typography color="error" variant="body2">
            {fetchError}
          </Typography>
        )}
        <EventSection title="Upcoming Events" events={createdUpcomingEvents} />
        <EventSection title="Past Events" events={createdPastEvents} />
      </Container>
    </>
  );
};

const EventSection = ({ title, events }) => (
  <>
    <Typography variant="h5" className="section-title">{title}</Typography>
    <Grid container spacing={2}>
      {events.length > 0 ? (
        events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card className="event-card">
              <CardContent>
                <Typography variant="h6" component="div">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time: {event.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {event.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {event.category}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={Link} 
                  to={`/event-organizer/${event._id}`} 
                  className="view-button"
                >
                  EVENT DETAIL
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No events found.
        </Typography>
      )}
    </Grid>
  </>
);

export default UserEvents;
