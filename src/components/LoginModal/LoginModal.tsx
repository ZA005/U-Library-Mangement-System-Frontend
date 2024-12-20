import React, { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility'; // Keeping only this one icon for toggling
import AccountCircle from '@mui/icons-material/LibraryBooks';
import LockIcon from '@mui/icons-material/Lock';
import './LoginModal.css';
import UserService from '../../services/UserService';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps {
  open: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [libraryCardNumber, setLibraryCardNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Toggle between password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (): Promise<void> => {
    try {
      const userData = await UserService.login(libraryCardNumber, password);
      console.log(userData);

      if (userData.token) {
        login(userData.token, userData.role); // Use the context's login function
        navigate('/search-book'); // Navigate to the profile page on successful login
        onClose(); // Close the modal after successful login
      } else {
        setError(userData.message); // Handle error message from the server
      }
    } catch (error: unknown) {
      console.error(error);
      setError('An unexpected error occurred'); // Handle unexpected errors
      setTimeout(() => {
        setError(null); // Reset error after a timeout
      }, 5000);
    }
  };

  const handleSignUp = () => {
    navigate('/verify');
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

          {error && <p className="error-message">{error}</p>}

          {/* Input fields */}
          <form onSubmit={handleLogin}>
            <TextField
              label="Library Card Number"
              variant="outlined"
              fullWidth
              margin="normal"
              className="modal-input"
              value={libraryCardNumber} // Controlled input
              onChange={(e) => setLibraryCardNumber(e.target.value)} // Handle input change
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
              value={password} // Controlled input
              onChange={(e) => setPassword(e.target.value)} // Handle input change
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

          </form>


          {error && <div className="error">{error}</div>} {/* Error message */}

          <Button
            variant="contained"
            sx={{ backgroundColor: '#d32f2f', color: '#fff', width: '100%', mt: 2 }}
            onClick={handleLogin}

          >
            Sign In
          </Button>

          <Typography variant="body2" className="modal-footer">
  Don't have an account?{' '}
  <Button
    color="inherit"
    sx={{ color: '#d32f2f', textDecoration: 'underline' }}
    onClick={() => {
      onClose(); // Close the login modal
      navigate('/verify'); // Redirect to the verify user page
    }}
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