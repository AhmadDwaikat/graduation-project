import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Typography, Grid, Card, CardContent, Button, CircularProgress, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { dispatch } = useEvent();
    const [loading, setLoading] = useState(true);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                const upcomingResponse = await axios.get('http://localhost:5000/api/events/user/upcoming', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const pastResponse = await axios.get('http://localhost:5000/api/events/user/past', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (upcomingResponse.data.success && pastResponse.data.success) {
                    setUpcomingEvents(upcomingResponse.data.data);
                    setPastEvents(pastResponse.data.data);
                    dispatch({ type: 'set_my_events', payload: [...upcomingResponse.data.data, ...pastResponse.data.data] });
                }
            } catch (err) {
                setError('Error fetching events: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [dispatch]);

    const handleCreateNewEvent = () => navigate('/event-creation');
    const handleEventClick = (id) => navigate(`/event-detail/${id}`);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    return (
        <Container className="dashboard-container">
            <Typography variant="h4" className="title">Dashboard</Typography>
            <QuickLinks onCreateNewEvent={handleCreateNewEvent} />
            <EventSection title="Featured Events" events={[]} onEventClick={handleEventClick} />
            <EventSection title="My Upcoming Events" events={upcomingEvents} onEventClick={handleEventClick} />
            <EventSection title="My Past Events" events={pastEvents} onEventClick={handleEventClick} />
        </Container>
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
        <Grid container spacing={4} className="activity-grid">
            {events && events.length > 0 ? (
                events.map(event => (
                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                        <Card className="activity-card" onClick={() => onEventClick(event._id)}>
                            <CardContent>
                                <Typography variant="h6" className="activity-title">{event.title}</Typography>
                                <Typography variant="body2" color="textSecondary" className="activity-details">
                                    Date: {new Date(event.date).toLocaleDateString()}
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
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            location: PropTypes.string.isRequired,
        })
    ).isRequired,
    onEventClick: PropTypes.func.isRequired,
};

export default Dashboard;
