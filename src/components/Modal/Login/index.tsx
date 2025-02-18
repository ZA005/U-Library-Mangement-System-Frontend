import React from 'react';
import { Box, Typography, Button, Modal, TextField, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import AccountCircle from '@mui/icons-material/LibraryBooks';
import LockIcon from '@mui/icons-material/Lock';
import elibLogo from '../../../assets/images/lms-logo.png'
import styles from './styles.module.css';

interface LoginProps {
    open: boolean;
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="login-modal" aria-describedby="login-modal-description">
            <Box className={styles.outerContainer}>
                {/* Header Section */}
                <Box className={styles.headerContainer}>
                    <img src={elibLogo} alt="Library Logo" className={styles.modalLogo} />
                    <Box>
                        <Typography variant="h5" className={styles.title}>ACQUIRE</Typography>
                        <Typography variant="subtitle1" className={styles.subtitle}>Library Management System</Typography>
                    </Box>
                </Box>

                {/* Login Form */}
                <Box className={styles.modalBox}>
                    <Box className={styles.loginHeader}>
                        <Typography variant="h6" className={styles.loginText}>Login</Typography>
                    </Box>

                    <form>
                        {/* UNC ID Input */}
                        <TextField
                            label="UNC ID number"
                            placeholder="Student/Employee ID"
                            variant="outlined"
                            fullWidth
                            margin="normal"
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
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className={styles.modalInput}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <Visibility />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Login Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ backgroundColor: '#d32f2f', color: '#fff', mt: 2 }}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Activate Account Button */}
                    <Typography variant="body2" className={styles.modalFooter} sx={{ mt: 1 }}>
                        <Button variant="outlined" color="inherit" fullWidth sx={{ color: '#d32f2f' }}>
                            Activate Account
                        </Button>
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
};

export default Login;
