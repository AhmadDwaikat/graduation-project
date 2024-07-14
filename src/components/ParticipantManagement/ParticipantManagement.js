import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Avatar } from '@mui/material';
import './ParticipantManagementPage.css';

const ParticipantManagementPage = () => {
  const { eventId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchParticipants = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFetchError('No token found');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/events/${eventId}/participants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        setParticipants(response.data.data);
      } else {
        console.error('Failed to fetch participants:', response.data.message);
        setFetchError('Failed to fetch participants');
      }
    } catch (err) {
      console.error('Error fetching participants:', err);
      setFetchError('Error fetching participants');
    }
  }, [eventId]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const handleAction = async (participantId, action) => {
    setActionError('');
    setActionSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setActionError('No token found');
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/events/${eventId}/participants/${participantId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setActionSuccess('Action successful');
        fetchParticipants(); // Refresh the list after action
      } else {
        console.error('Action failed:', response.data.message);
        setActionError('Action failed');
      }
    } catch (err) {
      console.error('Error performing action:', err);
      setActionError('Error performing action: ' + err.message);
    }
  };



  return (
    <Container maxWidth="lg" className="participant-management-container">
      <Typography variant="h4" className="title" gutterBottom>
        Participant Management
      </Typography>
      {fetchError && (
        <Typography color="error" variant="body2">
          {fetchError}
        </Typography>
      )}
      {actionError && (
        <Typography color="error" variant="body2">
          {actionError}
        </Typography>
      )}
      {actionSuccess && (
        <Typography color="primary" variant="body2">
          {actionSuccess}
        </Typography>
      )}
      <Grid container spacing={2}>
        {participants.map(participant => (
          <Grid item xs={12} sm={6} md={4} key={participant.user._id}>
            <Card className="participant-card">
              <CardContent>
                <Avatar
                  src={`http://localhost:5000/${participant.user.profilePicture}`}
                  alt={participant.user.name}
                  className="participant-avatar"
                />
                <Typography variant="h6" component="div">
                  {participant.user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {participant.status}
                </Typography>
              </CardContent>
              <CardActions>
                {participant.status === 'requested' && (
                  <>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleAction(participant.user._id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleAction(participant.user._id, 'reject')}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {participant.status === 'approved' && (
                  <>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleAction(participant.user._id, 'remove')}
                    >
                      Remove
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ParticipantManagementPage;
