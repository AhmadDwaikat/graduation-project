import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Badge, Menu, MenuItem, Avatar, ListItemIcon, Button } from '@mui/material';
import { Mail as MailIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, Settings as SettingsIcon, ExitToApp as ExitToAppIcon, Dashboard as DashboardIcon, LibraryBooks as LibraryBooksIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

const EventDetailHeader = ({ eventId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [messagesCount, setMessagesCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [profilePicture, setProfilePicture] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessagesCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/messages/count', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setMessagesCount(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching messages count:', error);
      }
    };

    const fetchNotificationsCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/notifications/count', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setNotificationsCount(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching notifications count:', error);
      }
    };

    const fetchProfilePicture = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setProfilePicture(response.data.data.profilePicture);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchMessagesCount();
    fetchNotificationsCount();
    fetchProfilePicture();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="fixed" className="header-fixed" sx={{ backgroundColor: '#333' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h4" noWrap sx={{ fontWeight: 'bold' }}>
            Social Activity App
          </Typography>
          <Button color="inherit" component={RouterLink} to="/dashboard" sx={{ marginLeft: 2 }}>
            <DashboardIcon sx={{ marginRight: 1 }} />
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/activity-library" sx={{ marginLeft: 2 }}>
            <LibraryBooksIcon sx={{ marginRight: 1 }} />
            Activity Library
          </Button>
          <Button color="inherit" component={RouterLink} to="/favorites" sx={{ marginLeft: 2 }}>
            <FavoriteIcon sx={{ marginRight: 1 }} />
            Favorites
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" component={RouterLink} to="/messages">
            <Badge badgeContent={messagesCount} color="error">
              <MailIcon sx={{ fontSize: 40 }} />
            </Badge>
          </IconButton>
          <IconButton color="inherit" component={RouterLink} to="/notifications">
            <Badge badgeContent={notificationsCount} color="error">
              <NotificationsIcon sx={{ fontSize: 40 }} />
            </Badge>
          </IconButton>
          <IconButton edge="end" color="inherit" onClick={handleMenu}>
            <Avatar sx={{ width: 40, height: 40 }} src={profilePicture} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: { width: '200px' },
            }}
          >
            <MenuItem component={RouterLink} to="/profile" onClick={handleClose} sx={{ fontSize: '1.1rem', padding: '10px 20px' }}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="large" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem component={RouterLink} to="/settings" onClick={handleClose} sx={{ fontSize: '1.1rem', padding: '10px 20px' }}>
              <ListItemIcon>
                <SettingsIcon fontSize="large" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ fontSize: '1.1rem', padding: '10px 20px' }}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="large" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

EventDetailHeader.propTypes = {
  eventId: PropTypes.string.isRequired,
};

export default EventDetailHeader;
