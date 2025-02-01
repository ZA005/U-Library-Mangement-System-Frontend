import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface FileInstructionDialogProps {
    open: boolean;
    onClose: () => void;
    onProceed: () => void;
}

const FileInstructionDialog: React.FC<FileInstructionDialogProps> = ({ open, onClose, onProceed }) => {
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="file-instruction-dialog-title">
            <DialogTitle id="file-instruction-dialog-title">{"Please Ensure Correct CSV Columns"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please ensure that the CSV file contains the following columns in order:
                    <strong> program_id, dept_id, code, description, status</strong>.
                    The column names are case-sensitive, so please double-check their exact spelling and capitalization before proceeding.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">Close</Button>
                <Button onClick={onProceed} color="primary">Proceed to Choose File</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileInstructionDialog;
