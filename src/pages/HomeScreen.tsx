// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Header from '../components/Header/Header';
import Carousel from '../components/Carousel/Carousel';
import ActionButtons from '../components/ActionButtons/ActionButtons';
import Footer from '../components/Footer/Footer';
import Line from '../components/Line/Line';
import Login from '../components/Modal/LoginModal/Login';
import VerifyUser from '../components/Verify/VerifyUser';

const HomeScreen: React.FC = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openVerifyUser, setOpenVerifyUser] = useState(false);

  const handleLogin = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleSignUp = () => {
    setOpenVerifyUser(true); // Open the Verify User modal
  };

  const handleCloseVerifyUser = () => {
    setOpenVerifyUser(false); // Close the Verify User modal
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
                Activate your account
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
      <Login open={openLogin} onClose={handleCloseLogin} />

      {/* Verify User Modal */}
      <VerifyUser open={openVerifyUser} onClose={handleCloseVerifyUser} />
    </Box>
  );
};

export default HomeScreen;
