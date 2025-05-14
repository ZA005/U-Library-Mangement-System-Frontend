import { Box, Button, Modal, TextField, Typography, InputAdornment, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { CircleUser } from 'lucide-react';
import eliblogo from '../../../assets/images/lms-logo.png';
import { useSendResetPasswordOTP } from './useSendResetPasswordOTP';
import { useIsActivated } from '../Verification/useIsActivated';
import { UserData } from '../../../types';
import { ConfirmOTP } from '../..';
import NewPassword from './NewPassword';

interface ForgotPasswordProps {
    open: boolean;
    onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ open, onClose }) => {
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);


    const { sendOTPResetPassword, isPending, isError, error: otpError } = useSendResetPasswordOTP();
    const { verifyUser, isPending: verifyPending, error: activateError } = useIsActivated();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!userId) {
            setError("UNC ID number is required");
            return;
        }

        verifyUser({ user_id: userId, isActivation: false }, {
            onSuccess: (data) => {
                console.log(data)
                if (data == 409) {
                    return;
                }

                sendOTPResetPassword({ userId, isActivation: false }, {
                    onSuccess: (data) => {
                        setUserData(data);
                        setOtpModalOpen(true);
                        onClose();
                    },
                    onError: (err) => setError(err.message),
                });
            },
            onError: (err) => setError(err.message || "Verification failed. Please try again."),
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const handleOtpModalClose = () => {
        setOtpModalOpen(false);
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const handleModalClose = () => {
        setUserId("");
        onClose();
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const handleOtpSuccess = () => {
        setOtpModalOpen(false);
        setShowPasswordModal(true);
    };

    /////////////////////////////////////////////////////////////////////////////////////


    return (
        <>
            <Modal
                open={open}
                onClose={handleModalClose}
                aria-labelledby="forgot-password-modal"
                aria-describedby="forgot-password-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        minWidth: { xs: '90%', sm: '400px' },
                        maxWidth: '450px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <Box
                        display="flex"
                        alignItems="center"
                        padding="16px"
                        sx={{ backgroundColor: '#d32f2f', color: 'white' }}
                    >
                        <img src={eliblogo} alt="Library Logo" style={{ width: '50px', marginRight: '12px' }} loading="lazy" />
                        <Box>
                            <Typography variant="h6" fontWeight="bold" fontFamily="Spartan, sans-serif">
                                ACQUIRE
                            </Typography>
                            <Typography variant="subtitle2" fontFamily="Spartan, sans-serif">
                                Library Management System
                            </Typography>
                        </Box>
                    </Box>

                    {/* Modal Content */}
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        padding="24px"
                        textAlign="center"
                    >
                        <Typography>Forgot password</Typography>
                        <Typography variant="body2" color="#666" mb={3} maxWidth="80%">
                            To reset your password enter your UNC ID Number to receive a verification code.
                        </Typography>

                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            {/* TextField for UNC ID */}
                            <TextField
                                label="UNC ID Number"
                                placeholder="XX-XXXXX"
                                value={userId}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    // Remove all non-digit and non-dash characters
                                    const sanitized = input.replace(/[^\d-]/g, "");

                                    // Allow either 'XX-XXXXX' or 'XXXXXXXX' (both max 8 characters total)
                                    if (
                                        /^\d{0,2}-?\d{0,5}$/.test(sanitized) || // Matches student ID pattern
                                        /^\d{0,8}$/.test(sanitized)             // Matches employee ID pattern
                                    ) {
                                        setUserId(sanitized);
                                    }
                                }}
                                required
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                inputProps={{ maxLength: 8, 'aria-label': 'UNC ID Number' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CircleUser size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Error Message */}
                            {(error || (isError && otpError) || activateError) && (
                                <Typography color="red" marginBottom="16px" fontSize="15px">
                                    {error || otpError?.message || activateError?.message}
                                </Typography>
                            )}

                            {/* Buttons */}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isPending}
                                fullWidth
                                sx={{
                                    height: '50px',
                                    backgroundColor: '#d32f2f',
                                    mb: 1,
                                }}
                            >
                                {isPending || verifyPending ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Send Verification Code'
                                )}
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                fullWidth
                                onClick={onClose}
                                sx={{ color: '#d32f2f', borderColor: '#d32f2f' }}
                            >
                                Cancel
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Modal>

            {/* OTP Modal */}
            {otpModalOpen && userData && (
                <ConfirmOTP open={otpModalOpen} onClose={handleOtpModalClose}
                    userData={userData} isPasswordReset={true}
                    onSuccessVerifyOTP={handleOtpSuccess} setUserData={setUserData} />
            )}

            {/* Password Modal */}
            {showPasswordModal && (
                <NewPassword
                    open={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    userId={userData?.id || ""} mode={'reset'} />
            )}
        </>
    );
};

export default ForgotPassword;