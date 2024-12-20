import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Line from '../Line/Line';
import './VerifyUser.css';
import UserService from '../../services/UserService';

const VerifyUser: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (): Promise<void> => {
    // e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call backend API to verify the student
      const data = await UserService.verifyUser(studentId);
      // Check if the data contains student information, meaning verification was successful
      if (data && data.id) {
        // If the OTP is sent, navigate to the OTP verification page with the studentId
        localStorage.setItem('emailAdd', data.emailAdd);
        navigate('/verify-otp');
      } else {
        // If the student is not found or enrolled, show an error
        setError('Student not found or not currently enrolled.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Handle any errors from the API call
      setError('Error verifying student ID.');
    } finally {
      // Set loading to false when the process completes
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Header buttons={null} />
        <Box
          className="centered-container"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Verify Student ID
          </Typography>

          {/* Red Line Container */}
          <Box className="red-line-container">
            <Line />
          </Box>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              className="send-otp-button"
              onClick={handleSubmit}
            >
              {loading ? 'Verifying...' : 'Send OTP'}
            </Button>
          </form>
        </Box>

      </Container>
      <Footer />
    </Box>
  );
};

export default VerifyUser;
