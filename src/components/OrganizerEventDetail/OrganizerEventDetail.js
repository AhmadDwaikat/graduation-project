import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, Button, Card, CardMedia, Box, CardActions, Dialog, DialogContent, IconButton, Paper } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Close, Delete } from '@mui/icons-material';
import './OrganizerEventDetail.css';

const OrganizerEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [openImage, setOpenImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/organizer/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data && response.data.success) {
          setEvent(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching event details:', error.message);
      }
    };

    fetchEvent();
  }, [id]);

  const handleAddMedia = async () => {
    try {
      const formData = new FormData();
      mediaFiles.forEach((file) => {
        formData.append('media', file);
      });

      const response = await axios.post(
        `http://localhost:5000/api/events/${id}/media`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setEvent(response.data.data);
        setMediaFiles([]);
        setFeedback({ message: 'Media added successfully', type: 'success' });
      } else {
        setFeedback({ message: response.data.message, type: 'error' });
      }
    } catch (error) {
      setFeedback({ message: `Error adding media: ${error.message}`, type: 'error' });
      console.error('Error adding media:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteMedia = async (file, type) => {
    const fileName = file.split('/').pop();
    console.log(`Attempting to delete ${type}: ${fileName}`);

    try {
      const response = await axios.delete(`http://localhost:5000/api/events/${id}/media/${type}/${fileName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && response.data.success) {
        setEvent(response.data.data);
        setFeedback({ message: `${type} deleted successfully`, type: 'success' });
      } else {
        setFeedback({ message: response.data.message || 'Error deleting media', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting media:', error.response ? error.response.data : error.message);
      setFeedback({ message: `Error deleting ${type}: ${error.response ? error.response.data.message : error.message}`, type: 'error' });
    }
  };

  const handleUpdateEvent = () => {
    navigate(`/event-update/${id}`);
  };

  const handleParticipantManagement = () => {
    navigate(`/event/${id}/participants`);
  };

  const handleClickImage = (image) => {
    setOpenImage(image);
  };

  const handleCloseImage = () => {
    setOpenImage(null);
  };

  const handleShare = (platform) => {
    const eventUrl = window.location.href;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${eventUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${eventUrl}`;
        break;
      default:
        break;
    }

    window.open(shareUrl, '_blank');
  };

  if (!event) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" className="organizer-event-detail-container">
      <Typography variant="h4" className="title" gutterBottom>
        {event.title}
      </Typography>
      <Paper elevation={3} className="event-detail-section">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" className="description" gutterBottom>
              {event.description}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" className="date" gutterBottom>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" className="time" gutterBottom>
              <strong>Time:</strong> {event.time}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" className="location" gutterBottom>
              <strong>Location:</strong> {event.location}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" className="event-type" gutterBottom>
              <strong>Event Type:</strong> {event.eventType}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" className="category" gutterBottom>
              <strong>Category:</strong> {event.category}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" className="participant-limit" gutterBottom>
              <strong>Participant Limit:</strong> {event.participantLimit}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {feedback.message && (
        <Typography
          variant="body2"
          className={`feedback ${feedback.type}`}
          gutterBottom
        >
          {feedback.message}
        </Typography>
      )}

      <Typography variant="h6" className="subtitle" gutterBottom>
        Ratings
      </Typography>
      <Box className="ratings-box">
        {event.ratings.map((rating) => (
          <Typography key={rating._id} className="rating-item">
            {rating.user.name}: {rating.rating}
          </Typography>
        ))}
      </Box>

      <Typography variant="h6" className="subtitle" gutterBottom>
        Comments
      </Typography>
      <Box className="comments-box">
        {event.comments.map((comment) => (
          <Typography key={comment._id} className="comment-item">
            {comment.user.name}: {comment.comment}
          </Typography>
        ))}
      </Box>

      <Typography variant="h6" className="subtitle" gutterBottom>
        Add Media (Images and Videos)
      </Typography>
      <input
        accept="image/*,video/*"
        type="file"
        multiple
        onChange={(e) => setMediaFiles([...e.target.files])}
        className="media-input"
      />
      <Button variant="contained" className="add-media-button" onClick={handleAddMedia}>
        Add Media
      </Button>

      <Typography variant="h6" className="subtitle" gutterBottom>
        Images
      </Typography>
      {event.images.length === 0 ? (
        <Typography>No images available.</Typography>
      ) : (
        <Grid container spacing={2} className="media-gallery">
          {event.images.map((image, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card className="media-card" onClick={() => handleClickImage(image)}>
                <CardMedia
                  component="img"
                  className="full-size-media"
                  image={`http://localhost:5000/${image}`}
                  alt={`Image ${index + 1}`}
                />
                <CardActions>
                  <IconButton
                    className="delete-button"
                    onClick={() => handleDeleteMedia(image, 'image')}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="h6" className="subtitle" gutterBottom>
        Videos
      </Typography>
      {event.videos.length === 0 ? (
        <Typography>No videos available.</Typography>
      ) : (
        <Grid container spacing={2} className="media-gallery">
          {event.videos.map((video, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card className="media-card">
                <CardMedia
                  component="iframe"
                  className="full-size-media card-media-iframe"
                  src={`http://localhost:5000/${video}`}
                  title={`Video ${index + 1}`}
                />
                <CardActions>
                  <IconButton
                    className="delete-button"
                    onClick={() => handleDeleteMedia(video, 'video')}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={Boolean(openImage)} onClose={handleCloseImage} maxWidth="md">
        <DialogContent>
          <img src={`http://localhost:5000/${openImage}`} alt="Selected" className="dialog-image" />
          <IconButton
            aria-label="close"
            className="close-button"
            onClick={handleCloseImage}
          >
            <Close />
          </IconButton>
        </DialogContent>
      </Dialog>

      <Box className="social-sharing">
        <Typography variant="h6" className="subtitle" gutterBottom>
          Share Event
        </Typography>
        <IconButton onClick={() => handleShare('facebook')}>
          <Facebook />
        </IconButton>
        <IconButton onClick={() => handleShare('twitter')}>
          <Twitter />
        </IconButton>
        <IconButton onClick={() => handleShare('linkedin')}>
          <LinkedIn />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        className="update-button"
        onClick={handleUpdateEvent}
      >
        Update Event
      </Button>

      <Button
        variant="contained"
        className="manage-participants-button"
        onClick={handleParticipantManagement}
      >
        Manage Participants
      </Button>
    </Container>
  );
};

export default OrganizerEventDetail;
