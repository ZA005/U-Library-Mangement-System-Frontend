import React from "react";
import {Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';


interface SignupModalProps {
    open: boolean;
    onClose: () => void;
}

const SignupModalProps: React.FC<SignupModalProps> = ({open, onClose}) => {
    const handleSignup = () => {
        //sign up logic here
        
        onClose
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle> Sign Up</DialogTitle>
            <DialogContent>
                <TextField label="Library ID Number" fullWidth margin="normal" />
            </DialogContent>
        </Dialog>
    )
}