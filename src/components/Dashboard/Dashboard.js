import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Typography, Grid, Card, CardContent, CircularProgress, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import DashboardHeader from './DashboardHeader';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { dispatch } = useEvent();
    const [loading, setLoading] = useState(true);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found');
                    setLoading(false);
                    return;
                }

                const [upcomingResponse, pastResponse, featuredResponse, recommendedResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/events/user/upcoming', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/events/user/past', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/events/high-rated', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/recommendations', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (upcomingResponse.data.success && pastResponse.data.success && featuredResponse.data.success && recommendedResponse.data.success) {
                    setUpcomingEvents(upcomingResponse.data.data.slice(0, 6) || []);
                    setPastEvents(pastResponse.data.data.slice(0, 6) || []);
                    setFeaturedEvents(featuredResponse.data.data.slice(0, 6) || []);
                    const sortedRecommendedEvents = (recommendedResponse.data.data || []).sort((a, b) => b.hybridScore - a.hybridScore);
                    setRecommendedEvents(sortedRecommendedEvents.slice(0, 6));  
                    dispatch({ type: 'set_my_events', payload: [...(upcomingResponse.data.data || []), ...(pastResponse.data.data || [])] });
                } else {
                    setError('Failed to fetch events');
                }
            } catch (err) {
                setError('Error fetching events: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [dispatch]);

    const handleEventClick = (id) => navigate(`/event-detail/${id}`);

    if (loading) {
        return <CircularProgress className="circular-progress" />;
    }

    if (error) {
        return <Typography variant="h6" color="error" className="error">{error}</Typography>;
    }

    return (
        <>
            <DashboardHeader />
            <Container className="dashboard-container">
                <Typography variant="h4" className="title">Dashboard</Typography>
                <EventSection title="Recommended Events" events={recommendedEvents} onEventClick={handleEventClick} showRating={false} />
                <EventSection title="Featured Events" events={featuredEvents} onEventClick={handleEventClick} showRating={true} />
                <EventSection title="My Upcoming Events" events={upcomingEvents} onEventClick={handleEventClick} showRating={true} />
                <EventSection title="My Past Events" events={pastEvents} onEventClick={handleEventClick} showRating={true} />
            </Container>
        </>
    );
};

const EventSection = ({ title, events, onEventClick, showRating }) => {
    if (!Array.isArray(events)) {
        console.error(`Invalid events data for ${title}:`, events);
        return null;
    }

    return (
        <>
            <Typography variant="h5" className="section-title">{title}</Typography>
            <Grid container spacing={4} className="activity-grid">
                {events.length > 0 ? (
                    events.map(event => {
                        const eventData = event.event || event;
                        return (
                            <Grid item xs={12} sm={6} md={4} key={eventData._id}>
                                <Card className="activity-card" onClick={() => onEventClick(eventData._id)}>
                                    <CardContent>
                                        <Typography variant="h6" className="activity-title">{eventData.title}</Typography>
                                        <Typography variant="body2" color="textSecondary" className="activity-details">
                                            {eventData.description}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" className="activity-details">
                                            Category: {eventData.category}
                                        </Typography>
                                        {showRating && (
                                            <Typography variant="body2" color="textSecondary" className="activity-details">
                                                Rating: {eventData.averageRating ? eventData.averageRating.toFixed(1) : 'N/A'}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <Typography variant="body2" color="textSecondary" className="no-data">
                        No {title.toLowerCase()} available.
                    </Typography>
                )}
            </Grid>
        </>
    );
};

EventSection.propTypes = {
    title: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(
        PropTypes.shape({
            event: PropTypes.shape({
                _id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                category: PropTypes.string.isRequired,
                averageRating: PropTypes.number,
            }),
            hybridScore: PropTypes.number,
        })
    ).isRequired,
    onEventClick: PropTypes.func.isRequired,
    showRating: PropTypes.bool,
};

export default Dashboard;
