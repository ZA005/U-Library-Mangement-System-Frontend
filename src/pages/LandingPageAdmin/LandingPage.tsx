import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './LandingPage.css'; // Import the CSS file

const LandingPage: React.FC = () => {
  return (
    <Box className="landing-page-container">
      <Container maxWidth="lg" className="landing-content">
        {/* Header */}
        <Header buttons={null} />

        {/* Main Content */}
        <Box className="landing-main-content">
          <Typography variant="h3" className="landing-title">
            Admin Dashboard
          </Typography>
          <Typography variant="body1" className="landing-description">
            Welcome! This is the Admins Dashboard, your central hub for managing the Library Management System (LMS).
          </Typography>

          {/* Centering the Line Component */}
          <Box className="line-container">
            {/* Line component, styled as needed */}
          </Box>

          {/* Action Buttons */}
          <Box className="action-buttons-container">
            <Button variant="contained" className="action-button">Item Search</Button>
            <Button variant="contained" className="action-button">Cataloging</Button>
            <Button variant="contained" className="action-button">Circulation</Button>
            <Button variant="contained" className="action-button">Book Reference</Button>
            <Button variant="contained" className="action-button">Acquisition</Button>
          </Box>

          {/* Additional Links */}
          <Box className="links-container">
            <Typography variant="body2" className="help-link">
              Stuck? <a href="https://example.com" target="_blank" rel="noopener noreferrer">Click here for help!</a>
            </Typography>
            <Typography variant="body2" className="additional-links">
              About LMS | LMS Administration | Authorities | Patrons | Serials
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default LandingPage;
