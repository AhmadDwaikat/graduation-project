import React from 'react';
import { Typography, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Check, Close, Notifications, Message } from '@mui/icons-material';
import { useEvent } from '../../context/EventContext';
import './ParticipantManagement.css';

const ParticipantManagement = () => {
    const { state, dispatch } = useEvent();
    const { participants } = state;

    const handleAccept = (participantId) => {
        const updatedParticipants = participants.map(participant =>
            participant.id === participantId ? { ...participant, status: 'Accepted' } : participant
        );
        dispatch({ type: 'set_participants', payload: updatedParticipants });
    };

    const handleReject = (participantId) => {
        const updatedParticipants = participants.map(participant =>
            participant.id === participantId ? { ...participant, status: 'Rejected' } : participant
        );
        dispatch({ type: 'set_participants', payload: updatedParticipants });
    };

    const handleSendNotification = (participantId) => {
        console.log(`Notification sent to participant ${participantId}`);
    };

    const handleSendMessage = (participantId) => {
        console.log(`Message sent to participant ${participantId}`);
    };

    return (
        <div className="participant-management-container">
            <Typography variant="h4" className="title">
                Participant Management
            </Typography>
            {participants.length === 0 ? (
                <Typography variant="body1" className="no-participants">
                    No participants to display.
                </Typography>
            ) : (
                <Grid container spacing={2} className="participant-grid">
                    {participants.map((participant) => (
                        <ParticipantCard
                            key={participant.id}
                            participant={participant}
                            onAccept={handleAccept}
                            onReject={handleReject}
                            onSendNotification={handleSendNotification}
                            onSendMessage={handleSendMessage}
                        />
                    ))}
                </Grid>
            )}
        </div>
    );
};

const ParticipantCard = ({ participant, onAccept, onReject, onSendNotification, onSendMessage }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Card className="participant-card">
            <CardContent>
                <Typography variant="body1" className="participant-name">
                    {participant.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" className="participant-details">
                    Status: {participant.status}
                </Typography>
                <div className="action-buttons">
                    <IconButton aria-label="accept" color="primary" onClick={() => onAccept(participant.id)}>
                        <Check />
                    </IconButton>
                    <IconButton aria-label="reject" color="secondary" onClick={() => onReject(participant.id)}>
                        <Close />
                    </IconButton>
                    <IconButton aria-label="send-notification" onClick={() => onSendNotification(participant.id)}>
                        <Notifications />
                    </IconButton>
                    <IconButton aria-label="send-message" onClick={() => onSendMessage(participant.id)}>
                        <Message />
                    </IconButton>
                </div>
            </CardContent>
        </Card>
    </Grid>
);

export default ParticipantManagement;
