import React, { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircle from '@mui/icons-material/LibraryBooks';
import LockIcon from '@mui/icons-material/Lock';
import elibLogo from '../../../assets/images/lms-logo.png'
import { useAuth } from '../../../contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../../services/Authentication/login';
import { LoginResponse } from '../../../types';
import styles from './styles.module.css';

interface LoginProps {
    open: boolean;
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ open, onClose }) => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login: authLogin } = useAuth();

    const loginMutation = useMutation<LoginResponse, Error, { userId: string; password: string }>({
        mutationFn: async ({ userId, password }) => {
            // 2-second delay before calling login
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return login(userId, password);
        },
        onSuccess: (data) => {
            console.log('Login successful', data);
            // If token and role are provided, update AuthContext and close the modal.
            if (data.token && data.role) {
                authLogin(data.token, data.role);
                onClose();
            } else {
                setErrorMessage('Login failed: Missing token or role.');
            }
        },
        onError: (error) => {
            console.error('Login error:', error);
            setErrorMessage('Invalid credentials or server error. Please try again.');
        },
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        loginMutation.mutate({ userId, password });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="login-modal"
            aria-describedby="login-modal-description"
        >
            <Box className={styles.outerContainer}>
                {/* Header Section */}
                <Box className={styles.headerContainer}>
                    <img src={elibLogo} alt="Library Logo" className={styles.modalLogo} />
                    <Box>
                        <Typography variant="h5" className={styles.title}>
                            ACQUIRE
                        </Typography>
                        <Typography variant="subtitle1" className={styles.subtitle}>
                            Library Management System
                        </Typography>
                    </Box>
                </Box>

                {/* Login Form */}
                <Box className={styles.modalBox}>
                    <Box className={styles.loginHeader}>
                        <Typography variant="h6" className={styles.loginText}>
                            Login
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        {/* UNC ID Input */}
                        <TextField
                            label="UNC ID number"
                            placeholder="Student/Employee ID"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className={styles.modalInput}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Password Input */}
                        <TextField
                            label="Password"
                            placeholder="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.modalInput}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            aria-label="toggle password visibility"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {errorMessage && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {errorMessage}
                            </Typography>
                        )}

                        {/* Login Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ backgroundColor: '#d32f2f', color: '#fff', mt: 2 }}
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    {/* Activate Account Button */}
                    <Box sx={{ mt: 1 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            fullWidth
                            sx={{ color: '#d32f2f' }}
                            disabled={loginMutation.isPending}
                        >
                            Activate Account
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default Login;