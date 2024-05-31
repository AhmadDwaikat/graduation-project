import React from 'react';
import { Typography, Grid, Avatar, Card, CardContent, Button } from '@mui/material';
import './Profile.css';
import eventData from './data.json'; // Import the temporary data

const Profile = () => {
    const { name, bio, profilePicture, eventsParticipated, upcomingEvents, pastEvents } = eventData.profile;

    return (
        <div className="profile-container">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card className="profile-card">
                        <CardContent>
                            <Avatar className="profile-avatar" alt="Profile Picture" src={profilePicture} />
                            <Typography variant="h5" className="profile-name">
                                {name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="profile-bio">
                                {bio}
                            </Typography>
                            <Button variant="contained" color="primary" className="edit-button">
                                Edit Profile
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Typography variant="h4" className="section-title">
                        My Events
                    </Typography>
                    <Typography variant="body1">
                        Events Participated: {eventsParticipated}
                    </Typography>
                    <Typography variant="body1">
                        Upcoming Events: {upcomingEvents}
                    </Typography>
                    <Typography variant="body1">
                        Past Events: {pastEvents}
                    </Typography>
                    {/* List of events */}
                    <Typography variant="h4" className="section-title">
                        My Ratings and Reviews
                    </Typography>
                    {/* Ratings and reviews */}
                </Grid>
            </Grid>
        </div>
    );
};

export default Profile;
