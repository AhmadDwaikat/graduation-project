import React from 'react';
import { Typography, List, ListItem, ListItemText, Badge } from '@mui/material';
import { useEvent } from '../../context/EventContext';
import './Messages.css';

const Messages = () => {
    const { state } = useEvent();
    const { messages } = state;

    return (
        <div className="messages-container">
            <Typography variant="h4" className="title">
                Messages
            </Typography>
            {messages.length === 0 ? (
                <Typography variant="body1" className="no-messages">
                    No messages to display.
                </Typography>
            ) : (
                <List className="conversations-list">
                    {messages.map((message) => (
                        <ListItem button key={message.id}>
                            <Badge color="secondary" variant="dot" invisible={message.read}>
                                <ListItemText primary={message.from} secondary={message.content} />
                            </Badge>
                        </ListItem>
                    ))}
                </List>
            )}
            <div className="chat-interface">
                {/* Chat interface component */}
            </div>
        </div>
    );
};

export default Messages;
