import { Box, TextField, Button } from "@mui/material";

interface SecondPageProps {
    onBack: () => void;
}

const SecondPage: React.FC<SecondPageProps> = ({ onBack }) => {
    return (
        <Box display="grid" gap={2}>
            <TextField fullWidth label="Status" name="status" />
            <TextField fullWidth label="Number of Copies" name="numberOfCopies" />
            <TextField fullWidth label="Purchase Price" name="purchasePrice" />
            <TextField fullWidth label="Location" name="location" />
            <TextField fullWidth label="Section" name="section" />
            <TextField fullWidth label="Date Acquired" name="dateAcquired" />
            <TextField fullWidth label="Vendor" name="vendor" />
            <TextField fullWidth label="Funding Source" name="fundingSource" />
            <TextField fullWidth label="Book Condition" name="bookCondition" />
            <TextField fullWidth label="Collection Type" name="collectionType" />

            {/* Buttons */}
            <Button fullWidth variant="outlined" color="secondary" onClick={onBack}>
                Back
            </Button>
            <Button fullWidth variant="contained" color="primary">
                Save
            </Button>
        </Box>
    );
};

export default SecondPage;
