import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Typography, Container, TextField, Button, Grid, Card, CardContent, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const { state } = useEvent();
    const { featuredEvents } = state;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState(featuredEvents);

    const handleSearch = () => {
        const filtered = featuredEvents.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
    };

    return (
        <Container maxWidth="lg" className="home-container">
            <Typography variant="h4" className="title" gutterBottom>
                Welcome to Social Activity App
            </Typography>
            <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <TextField
                    label="Search for Events"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="contained" color="primary" type="submit" className="search-button">
                    Search
                </Button>
            </form>
            <Typography variant="body1" gutterBottom>
                    social Activity
            </Typography>
            <Typography variant="h5" className="title" gutterBottom>
                Featured Events
            </Typography>
            <Grid container spacing={2} className="featured-events">
                {filteredEvents.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                        <Card className="featured-event-card">
                            <CardContent className="card-content">
                                <Typography variant="h6" className="event-title">
                                    <Link component={RouterLink} to={`/event-detail/${event.id}`}>
                                        {event.title}
                                    </Link>
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="event-details">
                                    Date: {event.date}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="event-details">
                                    Location: {event.location}
                                </Typography>
                                <Typography variant="body2" className="event-details">
                                    Description: {event.description}
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