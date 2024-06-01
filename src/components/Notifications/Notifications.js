import React from 'react';
import { Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './Notifications.css';
import eventData from '../data.json'; // Import the temporary data

const Notifications = () => {
    const { notifications } = eventData;

    return (
        <div className="notifications-container">
            <Typography variant="h4" className="title">
                Notifications
            </Typography>
            <List className="notifications-list">
                {notifications.map((notification) => (
                    <ListItem button key={notification.id}>
                        <ListItemText primary={notification.message} secondary={notification.timestamp} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Notifications;
