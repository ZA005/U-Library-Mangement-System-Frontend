import React, { useState, useRef } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { GENERAL_ROUTES } from "../../../config/routeConfig";
import { Modal, Box, Typography, Button, TextField, CircularProgress } from "@mui/material";
import { BadgeCheck } from "lucide-react";
import { UserData } from "../../../types";
import { useConfirmOTP } from "./useConfirmOTP";
import { useSendOTP } from "./useSendOTP";
import { useSendResetPasswordOTP } from "../ForgotPassword/useSendResetPasswordOTP";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";

interface VerifyOtpProps {
    open: boolean;
    onClose: () => void;
    userData: UserData;
    setUserData: (data: UserData) => void;
    isPasswordReset?: boolean;
    onSuccessVerifyOTP?: () => void;
}

const ConfirmOTP: React.FC<VerifyOtpProps> = ({ open, onClose, userData, setUserData, isPasswordReset, onSuccessVerifyOTP }) => {
    /////////////////////////////////////////////////////////////////////////////////////

    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [resendError, setResendError] = useState<string | null>(null);
    const [isResending, setIsResending] = useState(false);

    const showSnackbar = useSnackbarContext();

    /////////////////////////////////////////////////////////////////////////////////////

    const { confirmOTP, isError, error } = useConfirmOTP();
    const { sendOtp } = useSendOTP();
    const { sendOTPResetPassword } = useSendResetPasswordOTP();

    /////////////////////////////////////////////////////////////////////////////////////

    const handleSubmit = (otpCode: string) => {
        confirmOTP(
            { email: userData.emailAdd, otp: otpCode },
            {
                onSuccess: () => {
                    if (isPasswordReset) {
                        onClose();
                        onSuccessVerifyOTP?.();
                    } else {
                        onClose();
                        const path = generatePath(GENERAL_ROUTES.REGISTER, { user_id: userData.id });
                        navigate(path, { state: { userData } });
                    }
                },
            }
        );
    };


    /////////////////////////////////////////////////////////////////////////////////////

    const handleResend = () => {
        setResendError(null);
        setIsResending(true);

        const sendFunction = isPasswordReset ? sendOTPResetPassword : sendOtp;
        const isActivation = !isPasswordReset;
        sendFunction(
            { userId: userData.id, isActivation },
            {
                onSuccess: (data) => {
                    setIsResending(false);
                    setOtp(["", "", "", "", "", ""]);
                    setUserData(data);
                    showSnackbar("OTP resent successfully! Check your email.", "success");
                },
                onError: (err) => {
                    setIsResending(false);
                    setResendError(err.message || "Failed to resend OTP. Please try again.");
                    showSnackbar(resendError, "error");
                },
            }
        );
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const handleChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }

            if (newOtp.every(digit => digit !== "")) {
                handleSubmit(newOtp.join(""));
            }
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
                e.preventDefault();
            }
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="verify-otp-modal" aria-describedby="verify-otp-description">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minWidth="500px"
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
                <Box padding="24px" width="100%" textAlign="center">
                    <BadgeCheck
                        style={{
                            width: 60,
                            height: 60,
                            color: "#d32f2f",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            padding: "8px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
                        Enter Verification Code
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                        We have sent a code to your email <br /> <strong>{userData.emailAdd}</strong>
                    </Typography>
                    {/* OTP Input Fields */}
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                inputProps={{
                                    maxLength: 1,
                                    style: {
                                        textAlign: "center",
                                        fontSize: "1.5rem",
                                        width: "30px",
                                        height: "40px",
                                    },
                                }}
                                inputRef={(el) => (inputRefs.current[index] = el)}
                                variant="outlined"
                            />
                        ))}
                    </Box>

                    {isError && (
                        <Typography variant="body2" color="error" sx={{ mt: 1, mb: 2 }}>
                            {typeof error === "string" ? error : error?.message || "Something went wrong."}
                        </Typography>
                    )}
                    {/* Optional Verify Button as a fallback */}
                    <Button
                        type="button"
                        variant="contained"
                        sx={{
                            width: "80%",
                            height: "50px",
                            backgroundColor: "#d32f2f",
                            ":hover": {
                                backgroundColor: "darkred",
                            },
                        }}
                        onClick={() => handleSubmit(otp.join(""))}
                    >
                        Verify
                    </Button>

                    {/* Resend Code */}
                    <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                        Didn’t receive a code? <br />It might be in your spam or spam folder.{" "}<br />
                        <span
                            style={{ cursor: "pointer", color: "#d32f2f", textDecoration: "underline" }}
                            onClick={handleResend}
                        >
                            {isResending ? <CircularProgress size={16} color="inherit" /> : "Resend"}
                        </span>
                    </Typography>
                </Box>
            </Box>
        </Modal>

    );
};

export default ConfirmOTP;
