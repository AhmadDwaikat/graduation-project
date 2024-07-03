import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Badge, Menu, MenuItem, Avatar, Button } from '@mui/material';
import { Mail as MailIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useHeaderContent from './useHeaderContent';

const ReusableHeader = ({ profilePicture, messagesCount, notificationsCount, handleLogout }) => {
  const location = useLocation();
  const { title, links } = useHeaderContent();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (location.pathname === '/') {
    return null;
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#333' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {location.pathname !== '/login' && location.pathname !== '/signup' && (
            <Typography variant="h6" noWrap>
              {title}
            </Typography>
          )}
          {links.map((link) => (
            <Button key={link.to} color="inherit" component={RouterLink} to={link.to}>
              {link.label}
            </Button>
          ))}
        </Box>
        {location.pathname === '/dashboard' || location.pathname === '/profile' ? (
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
            >
              <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>Profile</MenuItem>
              <MenuItem component={RouterLink} to="/settings" onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

ReusableHeader.propTypes = {
  profilePicture: PropTypes.string,
  messagesCount: PropTypes.number,
  notificationsCount: PropTypes.number,
  handleLogout: PropTypes.func,
};

export default ReusableHeader;
