import React from 'react';
import { Typography, Grid, Card, CardContent, Button, IconButton } from '@mui/material';
import { Share, PersonAdd, PersonRemove } from '@mui/icons-material';
import './EventDetail.css';
import eventData from './data.json'; // Import the temporary data

const EventDetail = () => {
    const { title, date, location, description, participants, comments } = eventData.eventDetails;

    return (
        <div className="event-detail-container">
            <Typography variant="h4" className="title">
                Event Detail
            </Typography>
            <Card className="event-card">
                <CardContent>
                    <Typography variant="h6" className="event-title">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="event-details">
                        Date: {date}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="event-details">
                        Location: {location}
                    </Typography>
                    <Typography variant="body2" className="event-description">
                        {description}
                    </Typography>
                    <div className="action-buttons">
                        <Button variant="contained" color="primary" startIcon={<PersonAdd />}>
                            Join Event
                        </Button>
                        <Button variant="contained" color="secondary" startIcon={<PersonRemove />}>
                            Leave Event
                        </Button>
                        <IconButton aria-label="share">
                            <Share />
                        </IconButton>
                    </div>
                </CardContent>
            </Card>
            <Typography variant="h5" className="section-title">
                Participants
            </Typography>
            <Grid container spacing={2} className="participant-grid">
                {participants.map((participant) => (
                    <Grid item xs={12} sm={6} md={4} key={participant.id}>
                        <Card className="participant-card">
                            <CardContent>
                                <Typography variant="body1" className="participant-name">
                                    {participant.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="participant-details">
                                    Email: {participant.email}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Typography variant="h5" className="section-title">
                Comments
            </Typography>
            <div className="comments">
                {comments.map((comment) => (
                    <div className="comment" key={comment.id}>
                        <Typography variant="body1" className="comment-author">
                            {comment.author}
                        </Typography>
                        <Typography variant="body2" className="comment-content">
                            {comment.content}
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventDetail;
