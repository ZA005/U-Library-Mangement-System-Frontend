import React, { useEffect } from 'react';
import { Stack, Typography, Button, TextField, Autocomplete } from '@mui/material';
import { WeedingInfo } from '../../../../types/Catalog/WeedingInfo';
import { useAuth } from '../../../../contexts/AuthContext';
import { CustomDialog } from '../../../../components';

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
    "Cultural Significance",
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
    "Significant Literary or Artistic Contributions",
];

interface ReviewModalProps {
    open: boolean;
    handleClose: () => void;
    onConfirm: (bookWeedingStatusNotes: string) => void;
    weedInfo: WeedingInfo;
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
    isArchiving,
}) => {
    const [selectedReasons, setSelectedReasons] = React.useState<string[]>([]);
    const [notes, setNotes] = React.useState<string>('');
    const { role } = useAuth();

    // Parse existing bookWeedingStatusNotes to extract reasons and notes
    const parseNotes = (bookWeedingStatusNotes: string | undefined, isOverride: boolean, isArchiving: boolean) => {
        if (!bookWeedingStatusNotes) {
            return { reasons: [], notes: '' };
        }

        const reasonPrefix = isArchiving
            ? 'Reasons for Archiving: '
            : isOverride
                ? 'Reasons for Keeping: '
                : 'Reasons for Weeding: ';
        const notesPrefix = 'Notes: ';

        let reasons: string[] = [];
        let additionalNotes = '';

        // Split by reason prefix
        if (bookWeedingStatusNotes.includes(reasonPrefix)) {
            const [reasonPart, notesPart] = bookWeedingStatusNotes.split(notesPrefix);
            const reasonText = reasonPart.replace(reasonPrefix, '').replace(/\.\s*$/, '');
            reasons = reasonText.split(', ').filter((reason) =>
                (isArchiving ? archivingReasons : isOverride ? keptReasons : weedingReasons).includes(reason)
            );
            additionalNotes = notesPart ? notesPart.replace(/\.\s*$/, '') : '';
        } else if (bookWeedingStatusNotes.includes(notesPrefix)) {
            additionalNotes = bookWeedingStatusNotes.replace(notesPrefix, '').replace(/\.\s*$/, '');
        } else {
            additionalNotes = bookWeedingStatusNotes;
        }

        return { reasons, notes: additionalNotes };
    };

    useEffect(() => {
        if (open) {
            // Pre-populate reasons and notes for REVIEWED books
            if (weedInfo.weedStatus === 'REVIEWED' && !isFinalizingProcess && !isArchiving && !isOverride) {
                const { reasons, notes } = parseNotes(weedInfo.bookWeedingStatusNotes, isOverride, isArchiving);
                setSelectedReasons(reasons);
                setNotes(notes);
            } else {
                setSelectedReasons([]);
                setNotes('');
            }
        } else {
            setSelectedReasons([]);
            setNotes('');
        }
    }, [open, weedInfo, isOverride, isArchiving, isFinalizingProcess]);

    const createNotes = (reasons: string[], additionalNotes: string): string => {
        const reasonsText = reasons.length > 0
            ? `${isArchiving ? 'Reasons for Archiving' : isOverride ? 'Reasons for Keeping' : 'Reasons for Weeding'}: ${reasons.join(', ')}. `
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
                : weedInfo.weedStatus === 'REVIEWED' && (role === 'ADMIN' || role === 'LIBRARY DIRECTOR')
                    ? 'Confirm Weeding'
                    : 'Review Weeding';
    const confirmButtonText = isFinalizingProcess
        ? 'Complete Process'
        : isArchiving
            ? 'Confirm Archiving'
            : isOverride
                ? 'Confirm Keeping'
                : weedInfo.weedStatus === 'REVIEWED' && (role === 'ADMIN' || role === 'LIBRARY DIRECTOR')
                    ? 'Confirm Weeding'
                    : role === 'LIBRARIAN'
                        ? 'Mark for Review'
                        : 'Confirm Weeding';
    const confirmButtonColor = isFinalizingProcess ? '#3f51b5' : isOverride ? '#4CAF50' : '#EA4040';
    const confirmButtonHoverColor = isFinalizingProcess ? '#303f9f' : isOverride ? '#45a049' : '#d13333';

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
                    fullWidth
                />
            );
        }

        const bookInfo = (
            <>
                <Typography><strong>Flagged ID:</strong> {weedInfo.id}</Typography>
                <Typography><strong>Accession Number:</strong> {weedInfo.accessionNumber}</Typography>
                <Typography><strong>Call Number:</strong> {weedInfo.callNumber}</Typography>
                <Typography><strong>Title:</strong> {weedInfo.bookTitle}</Typography>
                <Typography><strong>Author/s:</strong> {weedInfo.authors}</Typography>
                <Typography><strong>Weeding Criteria DDC (10 Main Division):</strong> {weedInfo.weedingCriteriaDdc}</Typography>
                <Typography><strong>Review Notes:</strong> {weedInfo.bookWeedingStatusNotes || 'No notes available'}</Typography>
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
                            label={isArchiving ? 'Reasons for Archiving' : isOverride ? 'Reasons for Keeping' : 'Reasons for Weeding'}
                            placeholder="Select reasons"
                            required
                            error={selectedReasons.length === 0}
                            helperText={selectedReasons.length === 0 ? 'Please provide at least one reason' : ''}
                        />
                    )}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    multiline
                    rows={2}
                    variant="outlined"
                    label={isArchiving ? 'Notes for Archiving' : isOverride ? 'Notes for Keeping' : 'Additional Notes'}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any additional notes or comments here..."
                    fullWidth
                />
            </>
        );

        return (
            <Stack spacing={2}>
                {(role === 'LIBRARY DIRECTOR' || role === 'ADMIN') && bookInfo}
                {(isOverride || isArchiving || !isFinalizingProcess) && reasonsAndNotes}
            </Stack>
        );
    };

    return (
        <CustomDialog
            open={open}
            title={modalTitle}
            onClose={handleClose}
            content={renderContent()}
            actions={
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: confirmButtonColor,
                            color: '#fff',
                            textTransform: 'none',
                            ':hover': { backgroundColor: confirmButtonHoverColor },
                        }}
                        onClick={handleConfirm}
                        disabled={(!isFinalizingProcess && selectedReasons.length === 0 && (isOverride || isArchiving || !isOverride))}
                    >
                        {confirmButtonText}
                    </Button>
                </Stack>
            }
        />
    );
};

export default ReviewModal;