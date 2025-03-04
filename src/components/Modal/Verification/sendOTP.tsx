import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Modal, CircularProgress } from '@mui/material';
import eliblogo from '../../../assets/images/lms-logo.png';
import { ConfirmOTP } from '../..';
import { useSendOTP } from './useSendOTP';
import { useIsActivated } from './useIsActivated';
import { UserData } from '../../../types';

interface VerifyUserModalProps {
    open: boolean;
    onClose: () => void;
}

const VerifyUser: React.FC<VerifyUserModalProps> = ({ open, onClose }) => {
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const { sendOtp, isPending, isError, error: otpError } = useSendOTP();
    const { verifyUser, isPending: verifyPending, error: activateError } = useIsActivated();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!userId) {
            setError("User ID is required");
            return;
        }

        verifyUser(userId, {
            onSuccess: (data) => {
                console.log(data)
                if (data == 409) {
                    return;
                }

                sendOtp(userId, {
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


    const handleOtpModalClose = () => {
        setOtpModalOpen(false);
    };

    const handleModalClose = () => {
        setUserId("");
        onClose();
    };

    return (
        <>
            <Modal open={open} onClose={handleModalClose} aria-labelledby="verify-modal" aria-describedby="verify-modal-description">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minWidth="350px"
                    maxWidth="100%"
                    borderRadius="10px"
                    boxShadow="0 8px 16px rgba(0,0,0,0.2)"
                    overflow="hidden"
                    sx={{
                        backgroundColor: "white",
                        position: "absolute",
                        top: "45%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    {/* Header */}
                    <Box display="flex" width="100%" padding="16px 0 16px 5vw" color="white" gap="12px" sx={{ backgroundColor: "#d32f2f" }}>
                        <Box display="flex" flexDirection="row">
                            <img src={eliblogo} alt="e-library-logo" style={{ width: "50px" }} loading='lazy' />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" fontFamily="Spartan, sans-serif !important">
                                    ACQUIRE
                                </Typography>
                                <Typography variant="subtitle2" fontFamily="Spartan, sans-serif !important" lineHeight="80%">
                                    Library Management System
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Modal Content */}
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding="24px" width="100%" textAlign="center">
                        <Typography>Verify UNC ID Number</Typography>
                        <Typography color="#666" width="70%">
                            Enter your UNC ID Number to receive a verification code.
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            {/* TextField for Student ID */}
                            <TextField
                                label="UNC ID Number"
                                placeholder="XX-XXXXX"
                                value={userId}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    // Allow only digits and enforce the "XX-XXXXX" pattern
                                    const formattedInput = input.replace(/[^\d-]/g, "").slice(0, 8);
                                    if (/^\d{0,2}(-\d{0,5})?$/.test(formattedInput)) {
                                        setUserId(formattedInput);
                                    }
                                }}
                                required
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                inputProps={{ maxLength: 8 }}
                            />

                            {/* Error Message */}
                            {(error || (isError && otpError) || activateError) && (
                                <Typography color="red" marginBottom="16px" fontSize="15px">
                                    {error || otpError?.message || activateError?.message}
                                </Typography>
                            )}


                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isPending}
                                fullWidth
                                sx={{
                                    height: "50px",
                                    backgroundColor: "#d32f2f",
                                    ":hover": {
                                        backgroundColor: "darkred",
                                    },
                                }}
                            >
                                {isPending || verifyPending ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Modal>

            {/* OTP Modal */}
            {otpModalOpen && userData && (
                <ConfirmOTP open={otpModalOpen} onClose={handleOtpModalClose} userData={userData} />
            )}
        </>
    );
};

export default VerifyUser;
