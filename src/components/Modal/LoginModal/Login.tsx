import React, { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import AccountCircle from '@mui/icons-material/LibraryBooks';
import LockIcon from '@mui/icons-material/Lock';
import './LoginModal.css';
import UserService from '../../../services/UserManagement/UserService';
import { useAuth } from '../../../contexts/AuthContext';
import VerifyUser from '../../Verify/VerifyUser';
interface LoginProps {
  open: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [uncIdNumber, setUncIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null); // Reset error state before new login attempt

    if (!uncIdNumber || !password) {
      setError('Both library card number and password are required.');
      return;
    }

    try {
      const userData = await UserService.login(uncIdNumber, password);

      // Check for server-provided error messages
      if (!userData.token) {
        setError('Login failed. Please check your UNC ID number and password.');
        return;
      }

      login(userData.token, userData.role);

      if (userData.role === 'LIBRARIAN' || userData.role === 'ADMIN') {
        navigate('/admin/library');
        localStorage.setItem('uncIdNumber', uncIdNumber);
      } else if (userData.role === 'STUDENT') {
        navigate('/user/browse');
        localStorage.setItem('uncIdNumber', uncIdNumber);
      } else {
        navigate('/', { state: { uncIdNumber } }); // Default fallback
      }

      onClose();
    } catch (error: unknown) {
      console.error('Login Error:', error);

      // Handle specific error cases
      const err = error as { response?: { status: number, data?: { message: string } } };
      if (err.response?.status === 401) {
        setError('Invalid credentials. Please check your UNC ID number and password.');
      } else if (err.response?.status === 500) {
        setError('Internal server error. Our team is working on it. Please try again later.');
      } else if (err.response?.status === 400) {
        setError('Bad request. Please ensure the data you entered is correct.');
      } else if (err.response?.status === 404) {
        setError('The server could not be found. Please check your internet connection or try again later.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const [openVerifyUser, setOpenVerifyUser] = useState(false);

  const handleActivateAcc = () => {
    setOpenVerifyUser(true);
    onClose()
  };

  const handleCloseVerifyUser = () => {
    setOpenVerifyUser(false);
  };
  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="login-modal" aria-describedby="login-modal-description">
        <Box className="outer-container">
          <Box className="header-container">
            <img src="/src/assets/images/lms-logo.png" alt="Library Logo" className="modal-logo" />
            <Box>
              <Typography variant="h5" className="title">ACQUIRE</Typography>
              <Typography variant="subtitle1" className="subtitle">Library Management System</Typography>
            </Box>
          </Box>

          <Box className="modal-box">
            <Box className="login-header">
              <Typography variant="h6" className="login-text">Login</Typography>
            </Box>

            <form onSubmit={handleLogin}>
              <TextField
                label="UNC ID number"
                placeholder='Student/Employee ID'
                variant="outlined"
                fullWidth
                margin="normal"
                className="modal-input"
                value={uncIdNumber}
                onChange={(e) => setUncIdNumber(e.target.value)}
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
                placeholder='Password'
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                className="modal-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        <Visibility />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#d32f2f', color: '#fff', mt: 2 }}
              >
                Sign In
              </Button>
            </form>

            <Typography variant="body2" className="modal-footer" sx={{ mt: 1 }}>
              <Button
                variant='outlined'
                color="inherit"
                fullWidth
                sx={{ color: '#d32f2f' }}
                onClick={handleActivateAcc}
              >
                Activate Account
              </Button>
            </Typography>
          </Box>
        </Box>
      </Modal>
      <VerifyUser open={openVerifyUser} onClose={handleCloseVerifyUser} />
    </>

  );
};

export default Login;
