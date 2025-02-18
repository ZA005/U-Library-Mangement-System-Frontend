import React, { useState } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import styles from './styles.module.css'
interface VerifyOtpProps {
    open: boolean;
    onClose: () => void;
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({ open, onClose }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const emailAdd = localStorage.getItem("emailAdd") || "example@example.com";

    const handleChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
        }
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="verify-otp-modal" aria-describedby="verify-otp-description">
            <Box className={styles.verifyModalContainer}>

                {/* Modal Content */}
                <Box className={styles.verifyModalContent}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: { xs: 60, sm: 80, md: 90 }, color: "#cc0000", backgroundColor: "white", borderRadius: "50%", padding: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }} />
                    <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>Verify Your Code</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>We have sent a code to your email: <strong>{emailAdd}</strong></Typography>

                    {/* OTP Input Fields */}
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                inputProps={{
                                    maxLength: 1,
                                    style: {
                                        textAlign: "center",
                                        fontSize: "1.5rem",
                                        width: "30px",
                                        height: "40px",
                                    },
                                }}
                                variant="outlined"
                            />
                        ))}
                    </Box>

                    {/* Verify Button */}
                    <Button type="submit" variant="contained" className={styles.sendOtpButton}>
                        Verify
                    </Button>

                    {/* Resend Code */}
                    <Typography
                        variant="body2"
                        sx={{ mt: 2, cursor: "pointer", color: "#cc0000" }}
                        onClick={() => {
                            // Resend OTP logic here
                        }}
                    >
                        Didn’t receive a code? Resend
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
};

export default VerifyOtp;
