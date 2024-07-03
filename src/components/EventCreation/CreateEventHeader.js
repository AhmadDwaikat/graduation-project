import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import useHeaderContent from '../Header/useHeaderContent';

const CreateEventHeader = () => {
  const { links } = useHeaderContent();
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
              <List>
                {links.map((link) => (
                  link.label !== 'Dashboard' && (
                    <ListItem button key={link.to} component={RouterLink} to={link.to}>
                      <ListItemText primary={link.label} />
                    </ListItem>
                  )
                ))}
              </List>
            </Box>
          </Drawer>
          <Button color="inherit" component={RouterLink} to="/dashboard" sx={{ marginLeft: 2 }}>
            <DashboardIcon sx={{ marginRight: 1 }} />
            Dashboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CreateEventHeader;
