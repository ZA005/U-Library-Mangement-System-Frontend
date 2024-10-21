import React, { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility'; // Keeping only this one icon for toggling
import AccountCircle from '@mui/icons-material/LibraryBooks';
import LockIcon from '@mui/icons-material/Lock';
import './LoginModal.css';

interface LoginProps {
  open: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Toggle between password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="login-modal" aria-describedby="login-modal-description">
      <Box className="outer-container">
        {/* Header with logo and text aligned to the left */}
        <Box className="header-container">
          <img src="/src/assets/images/lms-logo.png" alt="Library Logo" className="modal-logo" />
          <Box>
            <Typography variant="h5" className="title">ACQUIRE</Typography>
            <Typography variant="subtitle1" className="subtitle">Library Management System</Typography>
          </Box>
        </Box>

        {/* Modal content */}
        <Box className="modal-box">
          {/* Login header with the red line beside */}
          <Box className="login-header">
            <Typography variant="h6" className="login-text">Login</Typography>
          </Box>

          {/* Input fields */}
          <TextField
            label="Library Card Number"
            variant="outlined"
            fullWidth
            margin="normal"
            className="modal-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'} // Toggles the input type
            variant="outlined"
            fullWidth
            margin="normal"
            className="modal-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    <Visibility /> {/* Only one visibility icon */}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            sx={{ backgroundColor: '#d32f2f', color: '#fff', width: '100%', mt: 2 }}
            onClick={onClose}
          >
            Sign In
          </Button>

          <Typography variant="body2" className="modal-footer">
            Don't have an account?{' '}
            <Button
              color="inherit"
              sx={{ color: '#d32f2f', textDecoration: 'underline' }}
              onClick={handleSignUp}
            >
              Sign up
            </Button>
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default Login;
