import React from 'react';
import { Typography, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Check, Close, Notifications, Message } from '@mui/icons-material';
import './ParticipantManagement.css';
import eventData from './data.json'; // Import the temporary data

const ParticipantManagement = () => {
    const { participants } = eventData;

    const handleAccept = (participantId) => {
        // Handle accept logic
    };

    const handleReject = (participantId) => {
        // Handle reject logic
    };

    const handleSendNotification = (participantId) => {
        // Handle send notification logic
    };

    const handleSendMessage = (participantId) => {
        // Handle send message logic
    };

    return (
        <div className="participant-management-container">
            <Typography variant="h4" className="title">
                Participant Management
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
                                    Status: {participant.status}
                                </Typography>
                                <div className="action-buttons">
                                    <IconButton aria-label="accept" color="primary" onClick={() => handleAccept(participant.id)}>
                                        <Check />
                                    </IconButton>
                                    <IconButton aria-label="reject" color="secondary" onClick={() => handleReject(participant.id)}>
                                        <Close />
                                    </IconButton>
                                    <IconButton aria-label="send-notification" onClick={() => handleSendNotification(participant.id)}>
                                        <Notifications />
                                    </IconButton>
                                    <IconButton aria-label="send-message" onClick={() => handleSendMessage(participant.id)}>
                                        <Message />
                                    </IconButton>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ParticipantManagement;
