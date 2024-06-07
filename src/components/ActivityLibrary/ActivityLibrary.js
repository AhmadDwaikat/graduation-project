import React, { useState } from 'react';
import {Typography,Grid,Card,CardContent,TextField,FormControl,InputLabel,Select,MenuItem,Button,Container,Paper,} from '@mui/material';
import { useEvent } from '../../context/EventContext';
import './ActivityLibrary.css';

const ActivityLibrary = () => {
    const { state } = useEvent();
    const { activities } = state;
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setFilterCategory(event.target.value);
    };

    const filteredActivities = activities.filter((activity) => {
        return (
            (filterCategory === '' || activity.category === filterCategory) &&
            (searchTerm === '' || activity.title.toLowerCase().includes(searchTerm.toLowerCase()))
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
                    activities={activities}
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
                {/* Assuming categories are unique */}
                {Array.from(new Set(activities.map((activity) => activity.category))).map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
            </Select>
        </FormControl>
        <Button variant="contained" color="primary" className="filter-button" style={{ marginTop: '1rem' }}>
            Apply Filter
        </Button>
    </div>
);

const ActivityGrid = ({ activities }) => (
    <Grid container spacing={2} className="activity-grid">
        {activities.map((activity) => (
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
);

export default ActivityLibrary;
