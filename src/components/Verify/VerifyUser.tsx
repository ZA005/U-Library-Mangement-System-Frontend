import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Line from '../Line/Line'; 
import './VerifyUser.css'; 

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
