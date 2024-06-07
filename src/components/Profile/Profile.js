import React, { useState } from 'react';
import { Typography, Grid, Avatar, Card, CardContent, Button, TextField } from '@mui/material';
import { useEvent } from '../../context/EventContext';
import './Profile.css';

const Profile = () => {
    const { state, dispatch } = useEvent();
    const { name, bio, profilePicture, eventsParticipated, upcomingEvents, pastEvents } = state.profile;

    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedBio, setEditedBio] = useState(bio);

    const handleSave = () => {
        dispatch({
            type: 'update_profile',
            payload: { name: editedName, bio: editedBio, profilePicture, eventsParticipated, upcomingEvents, pastEvents }
        });
        setEditMode(false);
    };

    return (
        <div className="profile-container">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <ProfileCard
                        editMode={editMode}
                        profilePicture={profilePicture}
                        name={editedName}
                        bio={editedBio}
                        setEditedName={setEditedName}
                        setEditedBio={setEditedBio}
                        setEditMode={setEditMode}
                        handleSave={handleSave}
                    />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <EventsSection
                        eventsParticipated={eventsParticipated}
                        upcomingEvents={upcomingEvents}
                        pastEvents={pastEvents}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

const ProfileCard = ({ editMode, profilePicture, name, bio, setEditedName, setEditedBio, setEditMode, handleSave }) => (
    <Card className="profile-card">
        <CardContent>
            <Avatar className="profile-avatar" alt="Profile Picture" src={profilePicture} />
            {editMode ? (
                <>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="profile-edit-field"
                    />
                    <TextField
                        label="Bio"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={bio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        className="profile-edit-field"
                    />
                    <Button variant="contained" color="primary" className="save-button" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="contained" color="secondary" className="cancel-button" onClick={() => setEditMode(false)}>
                        Cancel
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="h5" className="profile-name">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="profile-bio">
                        {bio}
                    </Typography>
                    <Button variant="contained" color="primary" className="edit-button" onClick={() => setEditMode(true)}>
                        Edit Profile
                    </Button>
                </>
            )}
        </CardContent>
    </Card>
);

const EventsSection = ({ eventsParticipated, upcomingEvents, pastEvents }) => (
    <>
        <Typography variant="h4" className="section-title">
            My Events
        </Typography>
        <Typography variant="body1">
            Events Participated: {eventsParticipated}
        </Typography>
        <Typography variant="body1">
            Upcoming Events: {upcomingEvents}
        </Typography>
        <Typography variant="body1">
            Past Events: {pastEvents}
        </Typography>
        {/* List of events */}
        <Typography variant="h4" className="section-title">
            My Ratings and Reviews
        </Typography>
        {/* Ratings and reviews */}
    </>
);

export default Profile;
