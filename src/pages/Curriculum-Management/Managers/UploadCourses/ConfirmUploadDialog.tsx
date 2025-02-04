import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface ConfirmUploadDialogProps {
    open: boolean;
    title: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmUploadDialog: React.FC<ConfirmUploadDialogProps> = ({
    open, title, content, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel
}) => {
    return (
        <Dialog open={open} onClose={onCancel} aria-labelledby="alert-dialog-title">
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{cancelText}</Button>
                <Button onClick={onConfirm} autoFocus>{confirmText}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmUploadDialog;
