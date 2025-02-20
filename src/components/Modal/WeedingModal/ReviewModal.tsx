import React, { useEffect } from 'react';
import { Modal, Box, Stack, Typography, Button } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import styles from '../styles.module.css';
import UserService from '../../../services/UserManagement/UserService';
import { WeedInfos } from '../../../model/Criteria';

const weedingReasons = [
    "Outdated Information",
    "Poor Physical Condition",
    "Low Circulation",
    "Duplicate Copies",
    "Content No Longer Relevant",
];

const keptReasons = [
    "Historical Value",
    "Unique Content",
    "High Future Use Potential",
    "Educational Importance",
    "Cultural Significance"
];

const archivingReasons = [
    "Preservation of Cultural Heritage",
    "Historical Record",
    "Protection from Damage or Loss",
    "Access for Future Research",
    "Legal or Copyright Considerations",
    "Unique or Special Editions",
    "Technological or Format Obsolescence",
    "Educational Value",
    "Public or Institutional Reference",
    "Significant Literary or Artistic Contributions"
];

interface ReviewModalProps {
    open: boolean;
    handleClose: () => void;
    onConfirm: (bookWeedingStatusNotes: string) => void;
    weedInfo: WeedInfos;
    isOverride: boolean;
    processNotes?: string;
    setProcessNotes?: (notes: string) => void;
    isFinalizingProcess?: boolean;
    isArchiving: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    open,
    handleClose,
    onConfirm,
    weedInfo,
    isOverride,
    processNotes,
    setProcessNotes,
    isFinalizingProcess = false,
    isArchiving
}) => {
    const [selectedReasons, setSelectedReasons] = React.useState<string[]>([]);
    const [notes, setNotes] = React.useState<string>('');

    useEffect(() => {
        if (!open) {
            setSelectedReasons([]);
            setNotes('');
        }
    }, [open]);

    const createNotes = (reasons: string[], additionalNotes: string): string => {
        const reasonsText = reasons.length > 0
            ? `${isArchiving ? 'Reasons for Archiving' : isOverride ? 'Reasons for Keeping' : 'Other reasons'}: ${reasons.join(', ')}. `
            : '';
        return `${reasonsText}${additionalNotes ? `Notes: ${additionalNotes}.` : ''}`.trim();
    };

    const handleConfirm = () => {
        const notesText = createNotes(selectedReasons, notes);
        onConfirm(notesText);
        handleClose();
    };

    const reasonsOptions = isArchiving ? archivingReasons : isOverride ? keptReasons : weedingReasons;
    const modalTitle = isFinalizingProcess
        ? `Weeding Process ID:${weedInfo.weedProcessId} Completion`
        : isArchiving
            ? 'Review Archiving'
            : isOverride
                ? 'Override Weeding'
                : 'Review Weeding';
    const confirmButtonText = isFinalizingProcess
        ? 'Complete Process'
        : isArchiving
            ? 'Confirm Archiving'
            : isOverride
                ? 'Confirm Keeping'
                : 'Confirm Weeding';
    const confirmButtonColor = isFinalizingProcess ? "#3f51b5" : (isOverride ? "#4CAF50" : "#EA4040");
    const confirmButtonHoverColor = isFinalizingProcess ? "#303f9f" : (isOverride ? "#45a049" : "#d13333");

    const renderContent = () => {
        if (isFinalizingProcess) {
            return (
                <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    label="Process Notes"
                    value={processNotes}
                    onChange={(e) => setProcessNotes && setProcessNotes(e.target.value)}
                    placeholder="Enter any notes about the weeding process..."
                />
            );
        }

        const bookInfo = (
            <>
                <Typography><strong>Flagged ID:</strong> {weedInfo.id}</Typography>
                <Typography><strong>Accession Number:</strong> {weedInfo.accessionNo}</Typography>
                <Typography><strong>Call Number:</strong> {weedInfo.callNumber}</Typography>
                <Typography><strong>Title:</strong> {weedInfo.bookTitle}</Typography>
                <Typography><strong>Author/s:</strong> {weedInfo.authors}</Typography>
                <Typography><strong>Weeding Criteria DDC (10 Main Division):</strong> {weedInfo.weedingCriteriaDdc}</Typography>
                <Typography><strong>Review Notes:</strong> {weedInfo.bookWeedingStatusNotes || "No notes available"}</Typography>
            </>
        );

        const reasonsAndNotes = (
            <>
                <Autocomplete
                    multiple
                    freeSolo
                    id="tags-outlined"
                    options={reasonsOptions}
                    getOptionLabel={(option) => option}
                    value={selectedReasons}
                    onChange={(_event, newValue) => setSelectedReasons(newValue)}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={isArchiving ? "Reasons for Archiving" : isOverride ? "Reasons for Keeping" : "Reasons for Weeding"}
                            placeholder="Select reasons"
                            required
                            error={selectedReasons.length === 0}
                            helperText={selectedReasons.length === 0 ? 'Please provide at least one reason' : ''}
                        />
                    )}
                />
                <TextField
                    multiline
                    rows={2}
                    variant="outlined"
                    label={isArchiving ? "Notes for Archiving" : isOverride ? "Notes for Keeping" : "Additional Notes"}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any additional notes or comments here..."
                />
            </>
        );

        return UserService.isAdmin() ? (
            <>
                {bookInfo}
                {(isOverride || isArchiving) && reasonsAndNotes}
            </>
        ) : reasonsAndNotes;
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                className={styles.modalBox}
                sx={{
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    '&::-webkit-scrollbar': {
                        width: '8px', // width of the scrollbar
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1', // track background color
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#888', // thumb color
                        borderRadius: '10px', // rounded corners for thumb
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555', // thumb color when hovered
                    },
                    '&::-webkit-scrollbar-corner': {
                        background: 'transparent', // bottom-right corner
                    },
                    /* For Firefox */
                    scrollbarWidth: 'thin', // set Firefox scrollbar width to 'thin'
                    scrollbarColor: '#888 #f1f1f1', // thumb color and track color for Firefox
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2" fontWeight="bold" className={styles.modalHeader}>
                        <span className={styles.modalHeaderLine} />
                        {modalTitle}
                    </Typography>
                    {renderContent()}
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: confirmButtonColor,
                            color: "#fff",
                            textTransform: "none",
                            ":hover": { backgroundColor: confirmButtonHoverColor },
                        }}
                        onClick={handleConfirm}
                    >
                        {confirmButtonText}
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

export default ReviewModal;