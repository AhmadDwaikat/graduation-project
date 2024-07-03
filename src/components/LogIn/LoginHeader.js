import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Drawer, Button } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const LoginHeader = () => {
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
          <Button color="inherit" component={RouterLink} to="/" sx={{ marginLeft: 2 }}>
            <HomeIcon sx={{ marginRight: 1 }} />
            Home
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LoginHeader;
