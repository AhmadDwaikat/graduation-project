import React from 'react';
import { Typography, Grid, Card, CardContent, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './Home.css';
import eventData from '../data.json'; // Import the temporary data

const Home = () => {
    const { featuredEvents } = eventData;

    return (
        <div className="home-container">
            <Typography variant="h4" className="title">
                Welcome to Social Activity App
            </Typography>
            <div className="search-container">
                <TextField
                    label="Search for Events"
                    variant="outlined"
                    className="search-bar"
                />
                <Button variant="contained" color="primary" className="search-button">
                    Search
                </Button>
            </div>
            <Typography variant="body1" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            </Typography>
            <Typography variant="h5" className="title">
                Featured Events
            </Typography>
            <Grid container spacing={2} className="featured-events">
                {featuredEvents.map((event) => (
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
        </div>
    );
};

export default Home;
