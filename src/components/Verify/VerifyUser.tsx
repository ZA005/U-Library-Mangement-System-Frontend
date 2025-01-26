import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Modal, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import './VerifyUser.css';

interface VerifyUserModalProps {
  open: boolean;
  onClose: () => void;
}

const VerifyUser: React.FC<VerifyUserModalProps> = ({ open, onClose }) => {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      const data = await UserService.verifyUser(studentId);
      if (data && data.id) {
        localStorage.setItem('emailAdd', data.emailAdd);
        navigate('/verify/user/otp');
      } else {
        setError('Student not found or not currently enrolled.');
      }
    } catch (error) {
      setError('Error verifying student ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="verify-modal"
      aria-describedby="verify-modal-description"
    >
      <Box className="verify-modal-container">
        {/* Header */}
        <Box className="verify-header">
          <img src="/src/assets/images/lms-logo.png" alt="Logo" className="verify-logo" />
          <Typography variant="h6" className="verify-header-text">
            ACQUIRE Library Management System
          </Typography>
        </Box>

        {/* Modal Content */}
        <Box className="verify-modal-content">
          <Typography className="modal-title">Verify UNC ID Number</Typography>
          <Typography className="modal-subtitle">
            Enter your UNC ID Number to receive a verification code.
          </Typography>

          <form onSubmit={(e) => e.preventDefault()} className="modal-form">
            {/* TextField for Student ID */}
            <TextField
              label="UNC ID Number"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              className="text-field"
            />
            {/* Error Message */}
            {error && (
              <Typography className="error-message">{error}</Typography>
            )}
            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="send-otp-button"
              onClick={handleSubmit}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
            </Button>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default VerifyUser;
