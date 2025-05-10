import React, { useState } from "react";
import {
    Modal, Box, Typography, TextField, Button, IconButton, CircularProgress
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import eliblogo from "../../../assets/images/lms-logo.png";
import { useResetPassword } from "./useResetPassword";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";

interface NewPasswordProps {
    open: boolean;
    onClose: () => void;
    userId: string;
    mode: "reset" | "change";
}

const NewPassword: React.FC<NewPasswordProps> = ({ open, onClose, userId, mode }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({ current: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState({ current: false, password: false, confirmPassword: false });

    const showSnackbar = useSnackbarContext();
    const { resetPassword, isPending, isError, error } = useResetPassword();

    const togglePasswordVisibility = (field: "current" | "password" | "confirmPassword") => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePasswordSubmit = async () => {
        setErrors({ current: "", password: "", confirmPassword: "" });

        const { default: validatePassword } = await import("../../../utils/validatePassword");

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setErrors((prev) => ({ ...prev, password: passwordError }));
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
            return;
        }

        if (mode === "change" && !currentPassword) {
            setErrors((prev) => ({ ...prev, current: "Current password is required." }));
            return;
        }

        resetPassword(
            {
                userId,
                password: newPassword,
                currentPassword: mode === "change" ? currentPassword : undefined
            },
            {
                onSuccess: () => {
                    showSnackbar(`Password ${mode === "change" ? "changed" : "reset"} successfully`, "success");
                    handleClose();
                },
                onError: () => {
                    showSnackbar(`Failed to ${mode === "change" ? "change" : "reset"} password`, "error");
                },
            }
        );
    };

    const handleClose = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({ current: "", password: "", confirmPassword: "" });
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    minWidth: { xs: "90%", sm: "400px" },
                    maxWidth: "450px",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <Box display="flex" alignItems="center" padding="16px" sx={{ backgroundColor: "#d32f2f", color: "white" }}>
                    <img src={eliblogo} alt="Library Logo" style={{ width: "50px", marginRight: "12px" }} loading="lazy" />
                    <Box>
                        <Typography variant="h6" fontWeight="bold">ACQUIRE</Typography>
                        <Typography variant="subtitle2">Library Management System</Typography>
                    </Box>
                </Box>

                {/* Content */}
                <Box display="flex" flexDirection="column" padding="24px">
                    <Typography variant="h6" gutterBottom textAlign="center">
                        {mode === "change" ? "Change Your Password" : "Reset Your Password"}
                    </Typography>

                    {/* Current Password (only in change mode) */}
                    {mode === "change" && (
                        <TextField
                            label="Current Password"
                            fullWidth
                            required
                            type={showPassword.current ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            error={!!errors.current}
                            helperText={errors.current}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => togglePasswordVisibility("current")} edge="end">
                                        {showPassword.current ? <EyeOff /> : <Eye />}
                                    </IconButton>
                                ),
                            }}
                            margin="normal"
                        />
                    )}

                    <TextField
                        label="New Password"
                        fullWidth
                        required
                        type={showPassword.password ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => togglePasswordVisibility("password")} edge="end">
                                    {showPassword.password ? <EyeOff /> : <Eye />}
                                </IconButton>
                            ),
                        }}
                        margin="normal"
                    />

                    <TextField
                        label="Confirm Password"
                        fullWidth
                        required
                        type={showPassword.confirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => togglePasswordVisibility("confirmPassword")} edge="end">
                                    {showPassword.confirmPassword ? <EyeOff /> : <Eye />}
                                </IconButton>
                            ),
                        }}
                        margin="normal"
                    />

                    {isError && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {error instanceof Error ? error.message : "Something went wrong"}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2, backgroundColor: "#d32f2f", ":hover": { backgroundColor: "darkred" } }}
                        onClick={handlePasswordSubmit}
                        disabled={isPending}
                    >
                        {isPending ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                    </Button>

                    <Button
                        variant="text"
                        color="inherit"
                        onClick={handleClose}
                        sx={{ mt: 1, color: "#d32f2f" }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default NewPassword;
