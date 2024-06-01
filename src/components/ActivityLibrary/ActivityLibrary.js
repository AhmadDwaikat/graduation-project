import React, { useState } from 'react';
import { Typography, Grid, Card, CardContent, TextField, Select, MenuItem, Button } from '@mui/material';
import './ActivityLibrary.css';
import activitiesData from '../data.json';

const ActivityLibrary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setFilterCategory(event.target.value);
    };

    const filteredActivities = activitiesData.activities.filter((activity) => {
        return (
            (filterCategory === '' || activity.category === filterCategory) &&
            (searchTerm === '' || activity.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <div className="activity-library-container">
            <Typography variant="h4" className="title">
                Activity Library
            </Typography>
            <div className="search-filter">
                <TextField
                    label="Search"
                    variant="outlined"
                    className="search-field"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Select
                    label="Filter by Category"
                    variant="outlined"
                    className="filter-field"
                    value={filterCategory}
                    onChange={handleCategoryChange}
                >
                    <MenuItem value="">All Categories</MenuItem>
                    {/* Dynamically add more categories based on the data */}
                    {Array.from(new Set(activitiesData.activities.map((activity) => activity.category))).map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                </Select>
                <Button variant="contained" color="primary" className="filter-button">
                    Apply Filter
                </Button>
            </div>
            <Grid container spacing={2}>
                {filteredActivities.map((activity) => (
                    <Grid item xs={12} sm={6} md={4} key={activity.id}>
                        <Card className="activity-card">
                            <CardContent>
                                <Typography variant="h6" className="activity-title">
                                    {activity.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="activity-details">
                                    Date: {activity.date}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="activity-details">
                                    Location: {activity.location}
                                </Typography>
                                {/* Add ratings and reviews */}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ActivityLibrary;
