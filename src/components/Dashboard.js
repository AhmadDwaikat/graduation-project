import React from 'react';
import { Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import eventData from './data.json'; // Import the temporary data

const Dashboard = () => {
    const navigate = useNavigate();

    const handleCreateNewEvent = () => {
        navigate('/event-creation');
    };

    return (
        <div className="dashboard-container">
            <Typography variant="h4" className="title">
                Dashboard
            </Typography>
            <div className="quick-links">
                <Button
                    variant="contained"
                    color="primary"
                    className="quick-link-button"
                    onClick={handleCreateNewEvent}
                >
                    Create New Event
                </Button>
            </div>
            <Typography variant="h5" className="section-title">
                Upcoming Activities
            </Typography>
            <Grid container spacing={2} className="activity-grid">
                {eventData.upcomingEvents.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                        <Card className="activity-card">
                            <CardContent>
                                <Typography variant="h6" className="activity-title">
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="activity-details">
                                    Date: {event.date}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="activity-details">
                                    Location: {event.location}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* Include past activities and activities sections */}
        </div>
    );
};

export default Dashboard;
