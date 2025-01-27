import React from 'react';
import { Modal, Box, Stack, Typography, Button } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import styles from '../styles.module.css'; // Adjust the path if necessary

const weedingReasons = [
    "Outdated Information",
    "Poor Physical Condition",
    "Low Circulation",
    "Duplicate Copies",
    "Content No Longer Relevant",
];

interface ModalWeedingProps {
    open: boolean;
    handleClose: () => void;
    onConfirm: (bookWeedingStatusNotes: string) => void;
}

const ModalWeeding: React.FC<ModalWeedingProps> = ({ open, handleClose, onConfirm }) => {
    const [selectedReasons, setSelectedReasons] = React.useState<string[]>([]);
    const [notes, setNotes] = React.useState<string>('');

    const createWeedingNotes = (reasons: string[], additionalNotes: string): string => {
        const reasonsText = reasons.length > 0 ? `Other reasons: ${reasons.join(', ')}. ` : '';
        return `${reasonsText}${additionalNotes ? `Notes: ${additionalNotes}.` : ''}`.trim();
    };

    const handleConfirm = () => {
        const notesText = createWeedingNotes(selectedReasons, notes);
        onConfirm(notesText);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className={styles.modalBox}
                sx={{
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    '&::-webkit-scrollbar': { display: 'none' },
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                }}
            >
                <Stack spacing={2}>
                    <Typography
                        variant="h6"
                        component="h2"
                        fontWeight="bold"
                        className={styles.modalHeader}
                    >
                        <span className={styles.modalHeaderLine} />
                        Review Weeding
                    </Typography>
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={weedingReasons}
                        getOptionLabel={(option) => option}
                        value={selectedReasons}
                        onChange={(_event, newValue) => setSelectedReasons(newValue)}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Other reason to weed"
                                placeholder="Select reasons for weeding"
                            />
                        )}
                    />
                    <TextField
                        multiline
                        rows={4}
                        variant="outlined"
                        label="Additional Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter any additional notes or comments here..."
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#EA4040",
                            color: "#fff",
                            textTransform: "none",
                            ":hover": { backgroundColor: "#d13333" },
                        }}
                        onClick={handleConfirm}
                    >
                        Confirm Weeding
                    </Button>
                    <Button
                        variant="text"
                        sx={{
                            color: "#EA4040",
                            textTransform: "none",
                            ":hover": { backgroundColor: "#f2f2f2", color: "#d13333" },
                        }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ModalWeeding;