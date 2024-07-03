import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Drawer, Button } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const UpdateEventHeader = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#333' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ fontSize: 40 }} />
          </IconButton>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              {/* Empty list */}
            </Box>
          </Drawer>
          <Button color="inherit" component={RouterLink} to="/dashboard" sx={{ marginLeft: 2 }}>
            <DashboardIcon sx={{ marginRight: 1 }} />
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/profile" sx={{ marginLeft: 2 }}>
            <AccountCircleIcon sx={{ marginRight: 1 }} />
            Profile
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UpdateEventHeader;
