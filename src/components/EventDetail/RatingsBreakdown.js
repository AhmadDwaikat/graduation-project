import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import './RatingsBreakdown.css';

const RatingsBreakdown = ({ ratings }) => {
  const totalRatings = ratings.reduce((acc, rating) => acc + rating.count, 0);
  const averageRating = (ratings.reduce((acc, rating) => acc + rating.value * rating.count, 0) / totalRatings).toFixed(1);

  return (
    <Box className="ratings-breakdown-container">
      <Box className="average-rating-container">
        <Typography variant="h2">{averageRating}</Typography>
        <Typography variant="subtitle1">Ratings and reviews</Typography>
        <Typography variant="body2">{totalRatings.toLocaleString()} ratings</Typography>
      </Box>
      <Box className="ratings-bars-container">
        {ratings.map((rating, index) => (
          <Box key={index} className="rating-bar-container">
            <Typography variant="body2">{rating.value}</Typography>
            <LinearProgress variant="determinate" value={(rating.count / totalRatings) * 100} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RatingsBreakdown;
