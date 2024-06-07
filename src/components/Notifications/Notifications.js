import React, { useState } from 'react';
import { Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEvent } from '../../context/EventContext';
import './Notifications.css';

const Notifications = () => {
    const { state, dispatch } = useEvent();
    const { notifications } = state;
    const [open, setOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const handleClickOpen = (notification) => {
        setSelectedNotification(notification);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedNotification(null);
    };

    const handleDelete = () => {
        const updatedNotifications = notifications.filter(notification => notification.id !== selectedNotification.id);
        dispatch({ type: 'set_notifications', payload: updatedNotifications });
        handleClose();
    };

    return (
        <div className="notifications-container">
            <Typography variant="h4" className="title">
                Notifications
            </Typography>
            {notifications.length === 0 ? (
                <Typography variant="body1" className="no-notifications">
                    No notifications to display.
                </Typography>
            ) : (
                <List className="notifications-list">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onDelete={() => handleClickOpen(notification)}
                        />
                    ))}
                </List>
            )}
            <DeleteDialog
                open={open}
                onClose={handleClose}
                onDelete={handleDelete}
            />
        </div>
    );
};

const NotificationItem = ({ notification, onDelete }) => (
    <ListItem button>
        <ListItemText primary={notification.message} secondary={notification.timestamp} />
        <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={onDelete}>
                <DeleteIcon />
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
);

const DeleteDialog = ({ open, onClose, onDelete }) => (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{"Delete Notification"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this notification?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Cancel
            </Button>
            <Button onClick={onDelete} color="primary" autoFocus>
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);

export default Notifications;
