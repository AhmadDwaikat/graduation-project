import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import useHeaderContent from './useHeaderContent';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useEvent();
  const { title, links } = useHeaderContent();

  const handleLogout = () => {
    dispatch({ type: 'logout' });
    navigate('/login');
  };

  
  if (location.pathname === '/') {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {title && (
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {links.map((link) => (
            <Button key={link.to} color="inherit" component={RouterLink} to={link.to}>
              {link.label}
            </Button>
          ))}
          {!state.isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup' && (
            <>
              <Button color="inherit" component={RouterLink} to="/signup">
                Sign Up
              </Button>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
            </>
          )}
          {state.isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
