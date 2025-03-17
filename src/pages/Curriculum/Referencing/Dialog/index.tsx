import React from "react";
import { Dialog, DialogTitle, DialogActions, DialogContent, IconButton, Button } from "@mui/material";

interface BookReferenceDialogProps {
    open: boolean;
    title: string;
    onClose: () => void;
    iconButton?: React.ReactNode;
    content: React.ReactNode;
    actions?: React.ReactNode;
}

const BookReferenceDialog: React.FC<BookReferenceDialogProps> = ({ open, title, onClose, iconButton, content, actions }) => {
    return (
        <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
            <DialogTitle>
                {title}
                {iconButton && (
                    <IconButton sx={{ position: "absolute", right: 20, top: 13 }}>
                        {iconButton}
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent dividers sx={{ minHeight: "300px", maxHeight: "500px", overflow: "auto" }}>
                {content}
            </DialogContent>
            <DialogActions>
                {actions}
                <Button onClick={onClose} variant="text" size="small" sx={{ color: "#d32f2f" }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookReferenceDialog;
