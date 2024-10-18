import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Header from '../components/Header/Header';
import Carousel from '../components/Carousel/Carousel';
import ActionButtons from '../components/ActionButtons/ActionButtons';
import Footer from '../components/Footer/Footer';
import Line from '../components/Line/Line';
import { useNavigate } from 'react-router-dom';

const HomeScreen: React.FC = () => {

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('register');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Header buttons={
          <>
            <Button color="inherit" onClick={handleSignUp}>Sign Up</Button>
            <Button color="inherit" onClick={handleLogin}>Login</Button>
          </>
        }
        />
          <Typography variant='h4'>Library Management System</Typography>
          <Line/>
        <Carousel />
        <ActionButtons />
      </Container>
      <Footer />
    </Box>
  );
};

export default HomeScreen;
