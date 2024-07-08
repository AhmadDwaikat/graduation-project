import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const SignupHeader = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#333' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={RouterLink} to="/" sx={{ marginLeft: 2 }}>
            <HomeIcon sx={{ marginRight: 1 }} />
            Home
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SignupHeader;
