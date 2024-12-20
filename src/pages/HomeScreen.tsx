// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Header from '../components/Header/Header';
import Carousel from '../components/Carousel/Carousel';
import ActionButtons from '../components/ActionButtons/ActionButtons';
import Footer from '../components/Footer/Footer';
import Line from '../components/Line/Line';
import { useNavigate } from 'react-router-dom';
import Login from "../components/LoginModal/LoginModal";


const HomeScreen: React.FC = () => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogin = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignUp = () => {
    navigate('/verify');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Header
          buttons={
            <>
              <Button
                color="inherit"
                onClick={handleSignUp}
                sx={{ color: '#d32f2f', border: '1px solid #d32f2f', marginRight: '10px' }}
              >
                Sign Up
              </Button>
              <Button
                color="inherit"
                onClick={handleLogin}
                sx={{ color: '#d32f2f', border: '1px solid #d32f2f' }}
              >
                Login
              </Button>
            </>
          }
        />
        <Typography variant="h4">Library Management System</Typography>
        <Line />
        <Carousel />
        <ActionButtons />
      </Container>

      <Footer />

      {/* Login Modal */}
      <Login open={open} onClose={handleClose} />
    </Box>
  );
};

export default HomeScreen;