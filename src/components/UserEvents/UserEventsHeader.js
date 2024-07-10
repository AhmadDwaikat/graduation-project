import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Avatar, ListItemIcon } from '@mui/material';
import { Event as EventIcon, LibraryBooks as LibraryBooksIcon, Favorite as FavoriteIcon, AccountCircle as AccountCircleIcon, Settings as SettingsIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserEventsHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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
    <AppBar position="fixed" sx={{ backgroundColor: '#333' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h4" noWrap sx={{ fontWeight: 'bold' }}>
            Social Activity App
          </Typography>
          <Box sx={{ display: 'flex', ml: 3 }}>
            <IconButton color="inherit" component={RouterLink} to="/event-creation">
              <EventIcon sx={{ fontSize: 30 }} />
              <Typography variant="body1" sx={{ ml: 1 }}>Create Event</Typography>
            </IconButton>
            <IconButton color="inherit" component={RouterLink} to="/activity-library">
              <LibraryBooksIcon sx={{ fontSize: 30 }} />
              <Typography variant="body1" sx={{ ml: 1 }}>Activity Library</Typography>
            </IconButton>
            <IconButton color="inherit" component={RouterLink} to="/favorites">
              <FavoriteIcon sx={{ fontSize: 30 }} />
              <Typography variant="body1" sx={{ ml: 1 }}>Favorites</Typography>
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

export default UserEventsHeader;
