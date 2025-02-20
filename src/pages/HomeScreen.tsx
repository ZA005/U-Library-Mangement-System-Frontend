// src/pages/HomeScreen.tsx
import React, { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { Helmet } from "react-helmet";
import Header from "../components/Header/Header";
import Carousel from "../components/Carousel/Carousel";
import ActionButtons from "../components/ActionButtons/ActionButtons";
import Footer from "../components/Footer/Footer";
import Line from "../components/Line/Line";
import VerifyUser from "../components/Verify/VerifyUser";
import Login from "../components/Modal/LoginModal/Login";

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
    setOpenVerifyUser(true);
  };

  const handleCloseVerifyUser = () => {
    setOpenVerifyUser(false);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
  
      <Helmet>
        <title>Home - Library Management System</title>
        <meta name="Home" content="Welcome to the Library Management System. Manage books, reservations, and more." />
        <link rel="icon" type="image/png" href="/assets/lms-logo.png" />

      </Helmet>

      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Header
          buttons={
            <>
              <Button
                variant='outlined'
                onClick={handleSignUp}
                sx={{ color: '#d32f2f', borderColor: ' #d32f2f', marginRight: '10px' }}
              >
                Activate account
              </Button>
              <Button
                variant='contained'
                onClick={handleLogin}
                sx={{ backgroundColor: '#d32f2f' }}
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
