import React from "react";
import { Dialog, DialogTitle, DialogActions, DialogContent, IconButton, Button, Box } from "@mui/material";

interface BookReferenceDialogProps {
    open: boolean;
    title: string;
    onClose: () => void;
    iconButtons?: React.ReactNode[];
    content: React.ReactNode;
    actions?: React.ReactNode;
    dialogSize?: "xs" | "sm" | "md" | "lg" | "xl";
}

const DynamicDialog: React.FC<BookReferenceDialogProps> = ({ open, title, dialogSize, onClose, iconButtons = [], content, actions }) => {
    return (
        <Dialog open={open} fullWidth maxWidth={dialogSize || "md"} onClose={onClose}>
            <DialogTitle display="flex" alignItems="center" justifyContent="space-between">
                {title}
                {iconButtons.length > 0 && (
                    <Box display="flex" alignItems="center" gap={3} flexDirection="row">
                        {iconButtons.map((icon, index) => (
                            <IconButton key={index} sx={{ p: 0 }}>
                                {icon}
                            </IconButton>
                        ))}
                    </Box>
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

export default DynamicDialog;
