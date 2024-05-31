import React from 'react';
import { Typography, List, ListItem, ListItemText, Badge } from '@mui/material';
import './Messages.css';
import eventData from './data.json'; // Import the temporary data

const Messages = () => {
    const { messages } = eventData;

    return (
        <div className="messages-container">
            <Typography variant="h4" className="title">
                Messages
            </Typography>
            <List className="conversations-list">
                {messages.map((message) => (
                    <ListItem button key={message.id}>
                        <Badge color="secondary" variant="dot" invisible={false}>
                            <ListItemText primary={message.from} secondary={message.content} />
                        </Badge>
                    </ListItem>
                ))}
            </List>
            <div className="chat-interface">
                {/* Chat interface component */}
            </div>
        </div>
    );
};

export default Messages;
