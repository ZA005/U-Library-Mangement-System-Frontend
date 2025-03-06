import React, { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import elibLogo from '../../../assets/images/lms-logo.png';
import styles from './styles.module.css';
import { useLogin } from './useLogin';
import loadable from '@loadable/component';
import { useModal } from '../../../hooks/Modal/useModal';
import { SendOTP } from '../..';
interface LoginProps {
    open: boolean;
    onClose: () => void;
}

const Visibility = loadable(() => import('@mui/icons-material/Visibility'));
const VisibilityOff = loadable(() => import('@mui/icons-material/VisibilityOff'));
const LockIcon = loadable(() => import('@mui/icons-material/Lock'))
const AccountCircle = loadable(() => import('@mui/icons-material/LibraryBooks'))

const Login: React.FC<LoginProps> = ({ open, onClose }) => {
    /////////////////////////////////////////////////////////////////////////////////////

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    /////////////////////////////////////////////////////////////////////////////////////

    const verifyModal = useModal();
    const { login, errorMessage, setErrorMessage } = useLogin(onClose);

    /////////////////////////////////////////////////////////////////////////////////////

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        login.mutate({ userId, password });
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const handleClose = () => {
        setUserId("")
        setPassword("")
        onClose()
    }

    /////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="login-modal"
                aria-describedby="login-modal-description"
            >
                <Box className={styles.outerContainer}>
                    {/* Header Section */}
                    <Box className={styles.headerContainer}>
                        <img src={elibLogo} alt="Library Logo" className={styles.modalLogo} loading='lazy' />
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
                                onChange={(e) => {
                                    const input = e.target.value;
                                    // Allow only digits and enforce the "XX-XXXXX" pattern
                                    const formattedInput = input.replace(/[^\d-]/g, "").slice(0, 8);
                                    if (/^\d{0,2}(-\d{0,5})?$/.test(formattedInput)) {
                                        setUserId(formattedInput);
                                    }
                                }}
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
                                disabled={login.isPending}
                            >
                                {login.isPending ? (
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
                                onClick={() => {
                                    verifyModal.open();
                                    onClose();
                                }}
                                sx={{ color: '#d32f2f' }}
                                disabled={login.isPending}
                            >
                                Activate Account
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <SendOTP open={verifyModal.isOpen} onClose={verifyModal.close} />
        </>


    );
};

export default Login;