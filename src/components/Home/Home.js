import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { Typography, Container, TextField, Grid, Card, CardContent, Link, InputAdornment, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import './Home.css';

const Home = () => {
    const { state } = useEvent();
    const { featuredEvents, isAuthenticated, user } = state;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Filter future events
        const futureEvents = featuredEvents.filter(event => new Date(event.date) > new Date());
        setFilteredEvents(futureEvents);
    }, [featuredEvents]);

    useEffect(() => {
        // Filter future events based on the search term
        const futureEvents = featuredEvents.filter(event => new Date(event.date) > new Date());
        const filtered = futureEvents.filter(event =>
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
            <Box className="overview-section">
                <Typography variant="h5" className="overview-title" gutterBottom>
                    Overview of the Application
                </Typography>
                <Box className="overview-content">
                    <EventIcon className="overview-icon" />
                    <Typography variant="body1" className="overview-text" gutterBottom>
                        Discover a variety of social activities, from local workshops to community services and trips with friends. Our platform offers the tools you need to make it happen seamlessly.
                    </Typography>
                </Box>
                <Box className="overview-content">
                    <GroupIcon className="overview-icon" />
                    <Typography variant="body1" className="overview-text" gutterBottom>
                        Join a community of like-minded individuals, create your own events, and manage your social activities effortlessly.
                    </Typography>
                </Box>
                <Box className="overview-content">
                    <VolunteerActivismIcon className="overview-icon" />
                    <Typography variant="body1" className="overview-text" gutterBottom>
                        Volunteer for community services and make a positive impact in your locality. Our platform connects you with opportunities to give back to the community.
                    </Typography>
                </Box>
            </Box>
            <form className="search-form" onSubmit={(e) => { e.preventDefault(); }}>
                <TextField
                    label="Search for Events"
                    variant="outlined"
                    margin="normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        classes: {
                            root: 'custom-text-field-root',
                            notchedOutline: 'custom-text-field-outline',
                        }
                    }}
                    sx={{
                        width: '400px',
                        background: 'linear-gradient(45deg, #f3ec78, #af4261)',
                        borderRadius: '30px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                                borderColor: 'transparent',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'transparent',
                            },
                        },
                        '& .MuiInputBase-input': {
                            padding: '10px 14px',
                            color: 'black',
                            fontSize: '1.5rem', // Larger text
                        },
                        '& .MuiInputAdornment-root': {
                            color: 'black',
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black',
                            fontSize: '1.5rem', // Larger label text
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                        },
                    }}
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
