import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, Button, Alert, CircularProgress, TextField, Rating } from '@mui/material';
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
import { useEvent } from '../../context/EventContext';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const { state: { user }, dispatch } = useEvent();
  const [event, setEvent] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        if (response.data && response.data.success) {
          setEvent(response.data.data);
          setComments(response.data.data.comments || []);
          setRatings(response.data.data.ratings || []);

          if (user && response.data.data.participants?.includes(user._id)) {
            setIsJoined(true);
          }

          const userRating = response.data.data.ratings.find(r => r.user._id === user._id);
          if (userRating) {
            setRating(userRating.rating);
          }
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError('Error fetching event details: ' + err.message);
      }
    };

    fetchEventDetails();
  }, [id, user]);

  useEffect(() => {
    if (user?.joinedEvents.includes(id)) {
      setIsJoined(true);
    }
  }, [user, id]);

  const handleJoinEvent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/events/${id}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsJoined(true);
      setSuccess('Successfully joined the event');
      setError('');
      dispatch({ type: 'join_event', payload: id });
    } catch (err) {
      setError('Error joining event: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/events/${id}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsJoined(false);
      setSuccess('Successfully left the event');
      setError('');
      dispatch({ type: 'leave_event', payload: id });
    } catch (err) {
      setError('Error leaving event: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/events/${id}/rate`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const existingRating = ratings.find(r => r.user._id === user._id);
      if (existingRating) {
        existingRating.rating = rating;
        setRatings([...ratings]);
      } else {
        setRatings([...ratings, { user: { _id: user._id, name: user.name }, rating }]);
      }
      setSuccess('Rating submitted successfully');
      setError('');
    } catch (err) {
      setError('Error submitting rating: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/events/${id}/comment`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, { user: { _id: user._id, name: user.name }, comment }]);
      setComment('');
      setSuccess('Comment submitted successfully');
      setError('');
    } catch (err) {
      setError('Error submitting comment: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    }
  };

  if (!event) {
    return <Typography variant="h6">Event not found</Typography>;
  }

  return (
    <div className="event-detail-container">
      <Typography variant="h4" className="title">
        Event Detail
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
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
              color={isJoined ? 'secondary' : 'primary'}
              startIcon={isJoined ? <PersonRemove /> : <PersonAdd />}
              onClick={isJoined ? handleLeaveEvent : handleJoinEvent}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : isJoined ? 'Leave Event' : 'Join Event'}
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
        Ratings
      </Typography>
      <div className="ratings-section">
        <Rating
          name="event-rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
        />
        <Button onClick={handleRatingSubmit} variant="contained" color="primary">
          Submit Rating
        </Button>
        <div className="existing-ratings">
          {ratings.map((rating, index) => (
            <Typography key={index} variant="body2">
              {rating.user.name}: {rating.rating} stars
            </Typography>
          ))}
        </div>
      </div>
      <Typography variant="h5" className="section-title">
        Comments
      </Typography>
      <div className="comments-section">
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={handleCommentSubmit} variant="contained" color="primary">
          Submit Comment
        </Button>
        <div className="existing-comments">
          {comments.map((comment, index) => (
            <Typography key={index} variant="body2">
              {comment.user.name}: {comment.comment}
            </Typography>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;