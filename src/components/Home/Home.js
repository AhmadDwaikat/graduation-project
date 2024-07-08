import React from 'react';
import { Typography, Container, Link, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn'; // Import LinkedIn icon
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './Home.css';

const Home = () => {

    return (
        <Container maxWidth="lg" className="home-container">
            <Typography variant="h4" className="title" gutterBottom>
                Welcome to Social Activity App
            </Typography>
            <Box className="overview-section">
                <Box className="overview-content">
                    <EventIcon className="overview-icon" />
                    <Typography variant="body1" className="overview-text" gutterBottom>
                        Discover a variety of social activities and seamlessly manage them with our tools.
                    </Typography>
                </Box>
                <Box className="overview-content">
                    <GroupIcon className="overview-icon" />
                    <Typography variant="body1" className="overview-text" gutterBottom>
                        Join a community, create events, and manage your activities effortlessly.
                    </Typography>
                </Box>
                <Box className="overview-content">
                    <VolunteerActivismIcon className="overview-icon" />
                    <Typography variant="body1" className="overview-text" gutterBottom>
                        Volunteer and positively impact your locality through our platform.
                    </Typography>
                </Box>
            </Box>
            <Box className="auth-section">
                <Typography variant="h6" className="auth-prompt">
                    Already have an account?
                    <Link component={RouterLink} to="/login" className="auth-link">
                        Login
                    </Link>
                </Typography>
                <Typography variant="body2" className="auth-description">
                    Access your account to manage and join events.
                </Typography>
                <Typography variant="h6" className="auth-prompt">
                    New user?
                    <Link component={RouterLink} to="/signup" className="auth-link">
                        Sign Up
                    </Link>
                </Typography>
                <Typography variant="body2" className="auth-description">
                    Create an account to start organizing and participating in activities.
                </Typography>
            </Box>
            <footer className="footer">
                <Box className="footer-content">
                    <Box className="footer-section">
                        <Typography variant="h6">Contact Us</Typography>
                        <Typography variant="body2">
                            <EmailIcon className="contact-icon" /> Email: <Link href="mailto:ahmaddwaikat6@gmail.com" color="inherit">ahmaddwaikat6@gmail.com</Link>
                        </Typography>
                        <Typography variant="body2">
                            <PhoneIcon className="contact-icon" /> Phone: +972 598 072 862
                        </Typography>
                        <Typography variant="body2">
                            <LocationOnIcon className="contact-icon" /> Address: Nablus, Palestine
                        </Typography>
                    </Box>
                    <Box className="footer-section">
                        <Typography variant="h6">Quick Links</Typography>
                        <Typography variant="body2"><Link component={RouterLink} to="/">Home</Link></Typography>
                        <Typography variant="body2"><Link component={RouterLink} to="/about">About Us</Link></Typography>
                        <Typography variant="body2"><Link component={RouterLink} to="/contact">Contact</Link></Typography>
                        <Typography variant="body2"><Link component={RouterLink} to="/services">Services</Link></Typography> {/* Added Services link */}
                    </Box>
                    <Box className="footer-section">
                        <Typography variant="h6">Follow Us</Typography>
                        <Box className="social-icons">
                            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FacebookIcon /></Link>
                            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer"><TwitterIcon /></Link>
                            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer"><InstagramIcon /></Link>
                            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><LinkedInIcon /></Link> {/* Added LinkedIn icon */}
                        </Box>
                    </Box>
                    <Box className="footer-section">
                        <Typography variant="h6">About the Project</Typography>
                        <Typography variant="body2">
                            Connecting individuals through social activities. Developed by Ahmad as a graduation project at NNU.
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="body2" className="footer-copy">© 2024 Social Activity App. All rights reserved.</Typography>
            </footer>
        </Container>
    );
};

export default Home;
