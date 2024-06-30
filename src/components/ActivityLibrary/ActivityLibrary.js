import React, { useState, useEffect } from 'react';
import {
  Typography, Grid, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, Container, Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import './ActivityLibrary.css';

const ActivityLibrary = () => {
  const [nonCreatedEvents, setNonCreatedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchNonCreatedEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events/non-created', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setNonCreatedEvents(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching non-created events:', error);
    }
  };

  useEffect(() => {
    fetchNonCreatedEvents();

    const interval = setInterval(fetchNonCreatedEvents, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const filteredActivities = nonCreatedEvents.filter((activity) => {
    const searchTermLower = searchTerm.toLowerCase();
    const searchMonth = parseInt(searchTerm, 10);
    const searchYear = parseInt(searchTerm, 10);
    const activityDate = new Date(activity.date);

    return (
      (filterCategory === '' || activity.category === filterCategory) &&
      (searchTerm === '' || 
        activity.title.toLowerCase().includes(searchTermLower) || 
        activity.location.toLowerCase().includes(searchTermLower) ||
        (!isNaN(searchMonth) && searchMonth >= 1 && searchMonth <= 12 && (activityDate.getMonth() + 1) === searchMonth) ||
        (!isNaN(searchYear) && searchYear.toString().length === 4 && activityDate.getFullYear() === searchYear)
      )
    );
  });

  return (
    <Container maxWidth="lg" className="activity-library-container">
      <Paper elevation={3} className="paper-container">
        <Typography variant="h4" className="title">
          Activity Library
        </Typography>
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterCategory={filterCategory}
          onCategoryChange={handleCategoryChange}
          activities={nonCreatedEvents}
        />
        <ActivityGrid activities={filteredActivities} />
      </Paper>
    </Container>
  );
};

const SearchFilter = ({ searchTerm, onSearchChange, filterCategory, onCategoryChange, activities }) => (
  <div className="search-filter">
    <TextField
      label="Search"
      variant="outlined"
      className="search-field"
      value={searchTerm}
      onChange={onSearchChange}
      fullWidth
    />
    <FormControl variant="outlined" className="filter-field" fullWidth>
      <InputLabel>Filter by Category</InputLabel>
      <Select
        value={filterCategory}
        onChange={onCategoryChange}
        label="Filter by Category"
      >
        <MenuItem value="">All Categories</MenuItem>
        {Array.from(new Set(activities.map((activity) => activity.category))).map((category) => (
          <MenuItem key={category} value={category}>{category}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
);

const ActivityGrid = ({ activities }) => (
  <Grid container spacing={2} className="activity-grid">
    {activities.map((activity) => (
      <Grid item xs={12} sm={6} md={4} key={activity._id}>
        <Link to={`/event-detail/${activity._id}`} className="event-link">
          <Card className="activity-card">
            <CardContent>
              <Typography variant="h6" className="activity-title">
                {activity.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="activity-details">
                Date: {new Date(activity.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="activity-details">
                Location: {activity.location}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="activity-details">
                Category: {activity.category}
              </Typography>
              <Typography variant="body2" className="activity-description">
                {activity.description}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    ))}
  </Grid>
);

export default ActivityLibrary;
