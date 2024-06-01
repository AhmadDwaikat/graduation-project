import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, Button, IconButton } from '@mui/material';
import { Share, PersonAdd, PersonRemove } from '@mui/icons-material';
import { useEvent } from '../../context/EventContext'; // Import the useEvent hook
import './EventDetail.css';
import eventData from '../data.json'; // Import the temporary data

const EventDetail = () => {
    const { id } = useParams();
    const { state, dispatch } = useEvent(); // Use the context

    // Find the event based on the id parameter from the URL
    const event = eventData.featuredEvents.find(event => event.id === parseInt(id)) ||
                  eventData.upcomingEvents.find(event => event.id === parseInt(id)) ||
                  eventData.pastEvents.find(event => event.id === parseInt(id));

    // Handle no event found case
    if (!event) {
        return <Typography variant="h6">Event not found</Typography>;
    }

    // Function to handle joining an event
    const handleJoinEvent = () => {
        dispatch({ type: 'join_event', payload: { id: event.id } });
    };

    // Function to handle leaving an event
    const handleLeaveEvent = () => {
        dispatch({ type: 'leave_event', payload: { id: event.id } });
    };

    return (
        <div className="event-detail-container">
            <Typography variant="h4" className="title">
                Event Detail
            </Typography>
            <Card className="event-card">
                <CardContent>
                    <Typography variant="h6" className="event-title">
                        {event.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="event-details">
                        Date: {event.date}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="event-details">
                        Location: {event.location}
                    </Typography>
                    <Typography variant="body2" className="event-description">
                        {event.description}
                    </Typography>
                    <div className="action-buttons">
                        {state.joined ? (
                            <Button variant="contained" color="secondary" startIcon={<PersonRemove />} onClick={handleLeaveEvent}>
                                Leave Event
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" startIcon={<PersonAdd />} onClick={handleJoinEvent}>
                                Join Event
                            </Button>
                        )}
                        <IconButton aria-label="share">
                            <Share />
                        </IconButton>
                    </div>
                </CardContent>
            </Card>
            <Typography variant="h5" className="section-title">
                Participants
            </Typography>
            {/* Participants and Comments can be added here */}
        </div>
    );
};

export default EventDetail;
