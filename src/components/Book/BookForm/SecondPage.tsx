/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, TextField, Button } from "@mui/material";

/**
 * SecondPage Component
 * --------------------
 * The second step of the cataloging form.
 * Allows users to input additional metadata such as acquisition details, condition, and collection type.
 */
interface SecondPageProps {
    onBack: () => void;
    formData: Record<string, any>;
    setFormData: (data: Record<string, any>) => void;
}

const SecondPage: React.FC<SecondPageProps> = ({ onBack, formData, setFormData }) => {
    /**
     * Handles input changes and updates formData state
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    console.log("DATA", formData);
    return (
        <Box display="grid" gap={2}>
            <TextField fullWidth label="Status" name="status" value={formData.status} onChange={handleChange} />
            <TextField fullWidth label="Number of Copies" name="numberOfCopies" value={formData.numberOfCopies} onChange={handleChange} />
            <TextField fullWidth label="Purchase Price" name="purchasePrice" value={formData.purchase_price} onChange={handleChange} />
            <TextField fullWidth label="Library" name="location" value={formData.vendor_location} onChange={handleChange} />
            <TextField fullWidth label="Section" name="section" value={formData.section} onChange={handleChange} />
            <TextField fullWidth label="Date Acquired" name="dateAcquired" value={formData.acquired_date} onChange={handleChange} />
            <TextField fullWidth label="Vendor" name="vendor" value={formData.vendor} onChange={handleChange} />
            <TextField fullWidth label="Funding Source" name="fundingSource" value={formData.funding_source} onChange={handleChange} />
            <TextField fullWidth label="Book Condition" name="bookCondition" value={formData.bookCondition} onChange={handleChange} />
            <TextField fullWidth label="Collection Type" name="collectionType" value={formData.collectionType} onChange={handleChange} />

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
