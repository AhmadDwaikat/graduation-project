import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Typography, Grid, Card, CardContent, CircularProgress, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import DashboardHeader from './DashboardHeader';
import { styled } from '@mui/system';
import './Dashboard.css';

const StyledContainer = styled(Container)(({ theme }) => ({
    padding: '20px',
    margin: 'auto',
    maxWidth: '1200px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
    color: '#343a40',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    },
}));

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
                    setRecommendedEvents(recommendedResponse.data.data.slice(0, 6) || []);
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
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    return (
        <>
            <DashboardHeader />
            <StyledContainer className="dashboard-container">
                <StyledTypography variant="h4" className="title">Dashboard</StyledTypography>
                <EventSection title="Recommended Events" events={recommendedEvents} onEventClick={handleEventClick} />
                <EventSection title="Featured Events" events={featuredEvents} onEventClick={handleEventClick} />
                <EventSection title="My Upcoming Events" events={upcomingEvents} onEventClick={handleEventClick} />
                <EventSection title="My Past Events" events={pastEvents} onEventClick={handleEventClick} />
            </StyledContainer>
        </>
    );
};

const EventSection = ({ title, events, onEventClick }) => {
    if (!Array.isArray(events)) {
        console.error(`Invalid events data for ${title}:`, events);
        return null;
    }

    return (
        <>
            <StyledTypography variant="h5" className="section-title">{title}</StyledTypography>
            <Grid container spacing={4} className="activity-grid">
                {events.length > 0 ? (
                    events.map(event => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <StyledCard className="activity-card" onClick={() => onEventClick(event._id)}>
                                <CardContent>
                                    <StyledTypography variant="h6" className="activity-title">{event.title}</StyledTypography>
                                    <Typography variant="body2" color="textSecondary" className="activity-details">
                                        Date: {new Date(event.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" className="activity-details">
                                        Location: {event.location}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" className="activity-details">
                                        Category: {event.category}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" className="activity-details">
                                        Rating: {event.averageRating ? event.averageRating.toFixed(1) : 'N/A'}
                                    </Typography>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))
                ) : (
                    <StyledTypography variant="body2" color="textSecondary" className="no-data">
                        No {title.toLowerCase()} available.
                    </StyledTypography>
                )}
            </Grid>
        </>
    );
};

EventSection.propTypes = {
    title: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            location: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired, // Added prop type for category
            averageRating: PropTypes.number,
        })
    ).isRequired,
    onEventClick: PropTypes.func.isRequired,
};

export default Dashboard;
