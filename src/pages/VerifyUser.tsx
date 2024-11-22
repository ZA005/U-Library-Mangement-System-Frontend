// src/pages/VerifyUser.tsx
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Line from '../components/Line/Line'; // Optional: Include if consistent design is needed
import './VerifyUser.css'; // Ensure CSS file has the necessary styles

const VerifyUser: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      // Simulated API call
      const data = await new Promise((resolve) =>
        setTimeout(() => resolve({ id: 1, emailAdd: 'example@unc.edu.ph' }), 1000)
      );
      if (data) {
        localStorage.setItem('emailAdd', (data as any).emailAdd);
        navigate('/verify-otp', { state: { userData: data } });
      } else {
        setError('Student not found or not currently enrolled.');
      }
    } catch {
      setError('Error verifying student ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
    <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
      <Header buttons={null} />
      <Typography variant="h4" align="center" gutterBottom>
        Verify Student ID
      </Typography>
  
      {/* Centering the Line Component */}
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
        <Line /> {/* Optional */}
      </Box>
  
      <Box sx={{ mt: 4, mx: 'auto', maxWidth: 400 }}>
        <form onSubmit={handleSubmit}>
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
