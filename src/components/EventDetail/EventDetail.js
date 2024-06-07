import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, Button } from '@mui/material';
import { PersonAdd, PersonRemove } from '@mui/icons-material';
import { useEvent } from '../../context/EventContext';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    FacebookMessengerShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    FacebookMessengerIcon
} from 'react-share';
import './EventDetail.css';
import eventData from '../data.json';

const EventDetail = () => {
    const { id } = useParams();
    const { state, dispatch } = useEvent();

    const event = state.featuredEvents.find(event => event.id === parseInt(id)) ||
                  state.myEvents.find(event => event.id === parseInt(id)) ||
                  eventData.featuredEvents.find(event => event.id === parseInt(id)) ||
                  eventData.upcomingEvents.find(event => event.id === parseInt(id)) ||
                  eventData.pastEvents.find(event => event.id === parseInt(id));

    if (!event) {
        return <Typography variant="h6">Event not found</Typography>;
    }

    const joinedEvents = state.joinedEvents || [];

    const handleJoinEvent = () => {
        console.log('Joining event:', event.id); // Debugging log
        dispatch({ type: 'join_event', payload: event.id });
    };

    const handleLeaveEvent = () => {
        console.log('Leaving event:', event.id); // Debugging log
        dispatch({ type: 'leave_event', payload: event.id });
    };

    const isJoined = joinedEvents.includes(event.id);

    return (
        <div className="event-detail-container">
            <Typography variant="h4" className="title">
                Event Detail
            </Typography>
            <Card className="event-card">
                <CardContent>
                    <Typography variant="h6" className="event-title">
                        {event.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="event-details">
                        Date: {event.date}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="event-details">
                        Location: {event.location}
                    </Typography>
                    <Typography variant="body2" className="event-description">
                        {event.description}
                    </Typography>
                    <div className="action-buttons">
                        <Button
                            variant="contained"
                            color={isJoined ? "secondary" : "primary"}
                            startIcon={isJoined ? <PersonRemove /> : <PersonAdd />}
                            onClick={isJoined ? handleLeaveEvent : handleJoinEvent}
                        >
                            {isJoined ? "Leave Event" : "Join Event"}
                        </Button>
                        <div className="share-buttons">
                            <FacebookShareButton url={window.location.href} quote={event.title}>
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>
                            <TwitterShareButton url={window.location.href} title={event.title}>
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                            <LinkedinShareButton url={window.location.href} title={event.title}>
                                <LinkedinIcon size={32} round />
                            </LinkedinShareButton>
                            <FacebookMessengerShareButton url={window.location.href} appId="YOUR_APP_ID">
                                <FacebookMessengerIcon size={32} round />
                            </FacebookMessengerShareButton>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Typography variant="h5" className="section-title">
                Participants
            </Typography>
            {/* Participants and Comments can be added here */}
        </div>
    );
};

export default EventDetail;
