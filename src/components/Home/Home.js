import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { Typography, Container, TextField, Grid, Card, CardContent, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const { state } = useEvent();
    const { featuredEvents, isAuthenticated, user } = state;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredEvents(featuredEvents);
    }, [featuredEvents]);

    useEffect(() => {
        const filtered = featuredEvents.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
    }, [searchTerm, featuredEvents]);

    const handleEventClick = (eventId, isOrganizer) => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (isOrganizer) {
            navigate(`/event-organizer/${eventId}`);
        } else {
            navigate(`/event-detail/${eventId}`);
        }
    };

    return (
        <Container maxWidth="lg" className="home-container">
            <Typography variant="h4" className="title" gutterBottom>
                Welcome to Social Activity App
            </Typography>
            <Typography variant="body1" className="overview" gutterBottom>
                Welcome to the Social Activity Participation Application, your ultimate platform for discovering, creating, and managing social activities! Our application is designed to bring people together by facilitating the organization and participation in a wide range of events. Whether you are looking to join a local workshop, volunteer for a community service, or plan a trip with friends, our platform offers the tools you need to make it happen seamlessly.
            </Typography>
            
            <form className="search-form" onSubmit={(e) => { e.preventDefault(); }}>
                <TextField
                    label="Search for Events"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <Typography variant="h5" className="title" gutterBottom>
                Featured Events
            </Typography>
            <Grid container spacing={2} className="featured-events">
                {filteredEvents.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                        <Card className="featured-event-card" onClick={() => handleEventClick(event._id, event.creator === user._id)}>
                            <CardContent className="card-content">
                                <Typography variant="h6" className="event-title">
                                    <Link component="button" onClick={() => handleEventClick(event._id, event.creator === user._id)}>
                                        {event.title}
                                    </Link>
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="event-details">
                                    Date: {new Date(event.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="event-details">
                                    Location: {event.location}
                                </Typography>
                                <Typography variant="body2" className="event-details">
                                    Description: {event.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="event-details">
                                    Average Rating: {event.averageRating}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Typography variant="body1" className="login-signup">
                Already have an account? <Link component={RouterLink} to="/login">Login</Link>
            </Typography>
            <Typography variant="body1" className="login-signup">
                New user? <Link component={RouterLink} to="/signup">Sign up</Link>
            </Typography>
        </Container>
    );
};

export default Home;
