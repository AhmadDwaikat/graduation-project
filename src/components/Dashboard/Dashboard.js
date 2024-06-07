import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import './Dashboard.css';
import eventData from '../data.json';

const Dashboard = () => {
    const navigate = useNavigate();
    const { dispatch } = useEvent();

    useEffect(() => {
        dispatch({ type: 'set_featured_events', payload: eventData.featuredEvents });
        dispatch({ type: 'set_my_events', payload: [...eventData.myEvents.upcoming, ...eventData.myEvents.past] });
    }, [dispatch]);

    const handleCreateNewEvent = () => navigate('/event-creation');
    const handleEventClick = (id) => navigate(`/event-detail/${id}`);

    return (
        <div className="dashboard-container">
            <Typography variant="h4" className="title">Dashboard</Typography>
            <QuickLinks onCreateNewEvent={handleCreateNewEvent} />
            <EventSection title="Featured Events" events={eventData.featuredEvents} onEventClick={handleEventClick} />
            <EventSection title="My Upcoming Events" events={eventData.myEvents.upcoming} onEventClick={handleEventClick} />
            <EventSection title="My Past Events" events={eventData.myEvents.past} onEventClick={handleEventClick} />
        </div>
    );
};

const QuickLinks = ({ onCreateNewEvent }) => (
    <div className="quick-links">
        <Button
            variant="contained"
            color="primary"
            className="quick-link-button"
            onClick={onCreateNewEvent}
        >
            Create New Event
        </Button>
    </div>
);

QuickLinks.propTypes = {
    onCreateNewEvent: PropTypes.func.isRequired,
};

const EventSection = ({ title, events, onEventClick }) => (
    <>
        <Typography variant="h5" className="section-title">{title}</Typography>
        <Grid container spacing={2} className="activity-grid">
            {events && events.length > 0 ? (
                events.map(event => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                        <Card className="activity-card" onClick={() => onEventClick(event.id)}>
                            <CardContent>
                                <Typography variant="h6" className="activity-title">{event.title}</Typography>
                                <Typography variant="body2" color="textSecondary" className="activity-details">
                                    Date: {event.date}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="activity-details">
                                    Location: {event.location}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography variant="body2" color="textSecondary" className="no-data">
                    No {title.toLowerCase()} available.
                </Typography>
            )}
        </Grid>
    </>
);

EventSection.propTypes = {
    title: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            location: PropTypes.string.isRequired,
        })
    ).isRequired,
    onEventClick: PropTypes.func.isRequired,
};

export default Dashboard;
