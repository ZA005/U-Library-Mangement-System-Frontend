import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Modal, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VerifyOtp from './OTP';
import styles from './styles.module.css'

interface VerifyUserModalProps {
    open: boolean;
    onClose: () => void;
}

const VerifyUser: React.FC<VerifyUserModalProps> = ({ open, onClose }) => {
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false); // State to control OTP modal visibility
    const navigate = useNavigate();

    const handleSubmit = async (): Promise<void> => {
        setError(null);
        setLoading(true);

        try {
            // Simulate verification process (use your actual service here)
            // const activationStatus = await UserService.isActivated(studentId);
            // if (activationStatus) {
            //     setError('This UNC ID number is already activated.');
            //     return;
            // }

            // Simulate successful verification, move to OTP modal
            // const data = await UserService.verifyUser(studentId);
            // if (data && data.id) {
            //     localStorage.setItem('emailAdd', data.emailAdd);
            //     localStorage.setItem('uncIdNumber', studentId);
            // } else {
            //     setError('Student not found or not currently enrolled.');
            // }

            // Open OTP modal
            setOtpModalOpen(true);
            onClose()
        } catch (error) {
            setError('Error verifying student ID: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleOtpModalClose = () => {
        setOtpModalOpen(false);
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="verify-modal"
                aria-describedby="verify-modal-description"
            >
                <Box className={styles.verifyModalContainer}>
                    {/* Header */}
                    <Box className={styles.verifyHeader}>
                        <img src="/src/assets/images/lms-logo.png" alt="Logo" className={styles.verifyLogo} />
                        <Typography variant="h6" className={styles.verifyHeaderText}>
                            ACQUIRE Library Management System
                        </Typography>
                    </Box>

                    {/* Modal Content */}
                    <Box className={styles.verifyModalContent}>
                        <Typography className={styles.modalTitle}>Verify UNC ID Number</Typography>
                        <Typography className={styles.modalSubtitle}>
                            Enter your UNC ID Number to receive a verification code.
                        </Typography>

                        <form onSubmit={(e) => e.preventDefault()} className={styles.modalForm}>
                            {/* TextField for Student ID */}
                            <TextField
                                label="UNC ID Number"
                                placeholder="Enter your Student/Employee UNC ID number"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                                margin="normal"
                                variant="outlined"
                                className={styles.textField}
                            />
                            {/* Error Message */}
                            {error && <Typography className={styles.errorMessage}>{error}</Typography>}
                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                className={styles.sendOtpButton}
                                onClick={handleSubmit}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Modal>

            {/* OTP Modal */}
            <VerifyOtp open={otpModalOpen} onClose={handleOtpModalClose} />
        </>
    );
};

export default VerifyUser;