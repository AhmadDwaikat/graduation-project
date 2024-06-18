import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, Button } from '@mui/material';
import { PersonAdd, PersonRemove } from '@mui/icons-material';
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

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        if (response.data && response.data.success) {
          setEvent(response.data.data);
        } else {
          console.error('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleJoinEvent = () => {
    setIsJoined(true);
    // Additional logic for joining the event can be added here
  };

  const handleLeaveEvent = () => {
    setIsJoined(false);
    // Additional logic for leaving the event can be added here
  };

  if (!event) {
    return <Typography variant="h6">Event not found</Typography>;
  }

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
            Date: {new Date(event.date).toLocaleDateString()}
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
