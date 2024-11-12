// src/pages/VerifyStudent.tsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';

const VerifyStudent: React.FC = () => {
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (): Promise<void> => {
        // e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Call your backend API to verify the student
            const data = await UserService.verifyUser(studentId);
            // Check if the data contains student information, meaning verification was successful
            if (data && data.id) {
                // If the OTP is sent, navigate to the OTP verification page
                // localStorage.setItem('studentId', data.studentId);
                localStorage.setItem('emailAdd', data.emailAdd);
                navigate('/verify-otp', { state: { userData: data } });
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
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" align="center">
                    Verify Student ID
                </Typography>

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

                    <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} fullWidth disabled={loading} sx={{ mt: 2 }}>
                        {loading ? 'Verifying...' : 'Send OTP'}

                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default VerifyStudent;
