import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Card, CardContent, Button, Alert, CircularProgress, TextField, Rating, Grid, CardMedia, IconButton, Avatar, Box, Dialog, DialogContent, DialogActions, Divider, Link } from '@mui/material';
import { PersonAdd, PersonRemove, Cancel, Message, Favorite, FavoriteBorder, Edit, Delete } from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useEvent } from '../../context/EventContext';
import RatingsBreakdown from './RatingsBreakdown';
import './EventDetail.css';

const EVENT_STATUS = {
  NONE: 'NONE',
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: { user }, dispatch } = useEvent();
  const [event, setEvent] = useState(null);
  const [eventStatus, setEventStatus] = useState(EVENT_STATUS.NONE);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [openImage, setOpenImage] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => {
    const requestedEvent = user?.requestedEvents?.find(event => event === id);
    const joinedEvent = user?.joinedEvents?.find(event => event === id);

    if (joinedEvent) {
      setEventStatus(EVENT_STATUS.APPROVED);
    } else if (requestedEvent) {
      setEventStatus(EVENT_STATUS.REQUESTED);
    } else {
      setEventStatus(EVENT_STATUS.NONE);
    }

    const isFavoriteEvent = user?.favorites?.includes(id)
    setIsFavorite(isFavoriteEvent)

  }, [user, id]);

  useEffect(() => {
    if (!user) return;

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        if (response.data && response.data.success) {
          const eventData = response.data.data;
          setEvent(eventData);
          setComments(eventData.comments || []);
          setRatings(eventData.ratings || []);

          const userRating = eventData.ratings.find(r => r.user && r.user._id === user._id);
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

  const handleRequestJoinEvent = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/events/${id}/request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEventStatus(EVENT_STATUS.REQUESTED);
      setSuccess('Join request sent successfully');
      setError('');
      dispatch({ type: 'join_event', payload: id });
    } catch (err) {
      if (err.response && err.response.data.message === 'Join request already sent') {
        setEventStatus(EVENT_STATUS.REQUESTED);
        setError('Join request already sent');
      } else {
        setError('Error sending join request: ' + (err.response?.data?.message || err.message));
        setSuccess('');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsendRequestJoinEvent = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/events/${id}/unsend-request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEventStatus(EVENT_STATUS.NONE);
      setSuccess('Join request unsent successfully');
      setError('');
      dispatch({ type: 'unsend_request', payload: id });
    } catch (err) {
      setError('Error unsending join request: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

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
      setEventStatus(EVENT_STATUS.NONE);
      setSuccess('Left event successfully');
      setError('');
      dispatch({ type: 'leave_event', payload: id });
    } catch (err) {
      if (err.response && err.response.data.message === 'User not part of this event') {
        setEventStatus(EVENT_STATUS.NONE);
        setError('User not part of this event');
      } else {
        setError('Error leaving event: ' + (err.response?.data?.message || err.message));
      }
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
      const existingRating = ratings.find(r => r.user && r.user._id === user._id);
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
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

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
      setComments([...comments, { user: { _id: user._id, name: user.name, profilePicture: user.profilePicture }, comment, createdAt: new Date() }]);
      setComment('');
      setSuccess('Comment submitted successfully');
      setError('');
    } catch (err) {
      setError('Error submitting comment: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    }
  };

  const handleCommentEdit = async (commentId, commentText) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/events/${id}/comment/${commentId}`,
        { comment: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedComments = comments.map((c) =>
        c._id === commentId ? { ...c, comment: commentText } : c
      );
      setComments(updatedComments);
      setEditCommentId(null);
      setEditCommentText('');
      setSuccess('Comment updated successfully');
      setError('');
    } catch (err) {
      setError('Error updating comment: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/events/${id}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedComments = comments.filter((c) => c._id !== commentId);
      setComments(updatedComments);
      setSuccess('Comment deleted successfully');
      setError('');
    } catch (err) {
      setError('Error deleting comment: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    }
  };

  const handleFavoriteToggle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/events/${isFavorite ? 'remove' : 'add'}/${id}`;
      await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsFavorite(!isFavorite);
      setError('');
      dispatch({ type: 'toggle_favorite', payload: id });
    } catch (err) {
      setError('Error updating favorite status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = async () => {
    if (!event || !event.creator || !event.creator._id) {
      setError('Event or organizer ID is undefined');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const organizerId = event.creator._id;
      const existingConversationId = user.conversations?.[organizerId];

      if (existingConversationId) {
        navigate(`/chat/${existingConversationId}`);
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/chat/conversation',
          { userId: organizerId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const newConversation = response.data.data;
        navigate(`/chat/${newConversation._id}`);
        dispatch({ type: 'update_conversations', payload: { organizerId, conversationId: newConversation._id } });
      }
    } catch (err) {
      setError('Error opening chat: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleImageClick = (image) => {
    setOpenImage(image);
  };

  const handleCloseImage = () => {
    setOpenImage(null);
  };

  if (!event) {
    return <Typography variant="h6">Event not found</Typography>;
  }

  // Calculate rating counts
  const ratingCounts = [5, 4, 3, 2, 1].map(value => ({
    value,
    count: ratings.filter(rating => rating.rating === value).length
  }));

  return (
    <div className="event-detail-container">
      <Typography variant="h4" className="title">
        Event Detail
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <div className="event-details">
        <Typography variant="h6" className="event-title">
          {event.title}
        </Typography>
        <Divider />
        <Typography variant="body2" color="textSecondary">
          <strong>Date:</strong> {moment(event.date).format('LL')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Time:</strong> {moment(event.time, 'HH:mm').format('h:mm A')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Location:</strong> {event.location}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Creator:</strong> {event.creator.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Category:</strong> {event.category}
        </Typography>
        <Typography variant="body2" className="event-description">
          {event.description}
        </Typography>
        <div className="action-buttons">
          {eventStatus === EVENT_STATUS.NONE && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAdd />}
              onClick={handleRequestJoinEvent}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Request'}
            </Button>
          )}
          {eventStatus === EVENT_STATUS.REQUESTED && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Cancel />}
              onClick={handleUnsendRequestJoinEvent}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Unsend Request'}
            </Button>
          )}
          {eventStatus === EVENT_STATUS.APPROVED && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PersonRemove />}
              onClick={handleLeaveEvent}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Leave Event'}
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<Message />}
            onClick={handleOpenChat}
          >
            Chat with Organizer
          </Button>
          <IconButton onClick={handleFavoriteToggle} disabled={loading}>
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <div className="share-buttons">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookIcon className="share-icon" />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <TwitterIcon className="share-icon" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="share-icon" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="share-icon" />
            </Link>
          </div>
        </div>
      </div>
      <Typography variant="h5" className="section-title">
        Images
      </Typography>
      <Grid container spacing={2} className="media-gallery">
        {event.images.map((image, index) => (
          <Grid item key={index}>
            <Card className="media-card" onClick={() => handleImageClick(image)}>
              <CardMedia component="img" height="140" image={`http://localhost:5000/${image}`} alt={`Image ${index + 1}`} />
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={!!openImage} onClose={handleCloseImage} maxWidth="lg">
        <DialogContent>
          <img src={`http://localhost:5000/${openImage}`} alt="Selected" style={{ width: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImage} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h5" className="section-title">
        Ratings
      </Typography>
      <RatingsBreakdown ratings={ratingCounts} />
      <div className="ratings-section">
        <Rating
          name="event-rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
        />
        <Button onClick={handleRatingSubmit} variant="contained" color="primary">
          Submit Rating
        </Button>
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
          <div className="comment-grid">
            {comments.map((comment, index) => (
              <Card key={index} className="comment-card">
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Avatar src={`http://localhost:5000/${comment.user.profilePicture}`} />
                    <Box ml={2}>
                      <Typography variant="body1">{comment.user.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{moment(comment.createdAt).format('LL')}</Typography>
                    </Box>
                  </Box>
                  {editCommentId === comment._id ? (
                    <Box>
                      <TextField
                        variant="outlined"
                        fullWidth
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCommentEdit(comment._id, editCommentText)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setEditCommentId(null);
                          setEditCommentText('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" className="comment-text">{comment.comment}</Typography>
                  )}
                  {user._id === comment.user._id && (
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                      <IconButton size="small" onClick={() => {
                        setEditCommentId(comment._id);
                        setEditCommentText(comment.comment);
                      }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleCommentDelete(comment._id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
