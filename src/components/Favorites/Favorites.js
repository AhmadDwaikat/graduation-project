import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FavoritesHeader from './FavoritesHeader'; // Import the new header

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/events/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setFavorites(response.data.data);
        }
      } catch (err) {
        setError('Error fetching favorite events: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <>
      <FavoritesHeader />
      <div>
        <Typography variant="h4" gutterBottom>Favorite Events</Typography>
        <Grid container spacing={2}>
          {favorites.map(event => (
            <Grid item key={event._id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{event.title}</Typography>
                  <Typography variant="body2">{new Date(event.date).toLocaleDateString()}</Typography>
                  <RouterLink to={`/event-detail/${event._id}`}>View Details</RouterLink>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
};

export default Favorites;