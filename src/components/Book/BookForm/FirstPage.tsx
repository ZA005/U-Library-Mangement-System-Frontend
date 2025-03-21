/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, TextField, Button } from "@mui/material";

/**
 * FirstPage Component
 * -------------------
 * The first step of the cataloging form.
 * Allows users to input book metadata such as title, author, ISBN, etc.
 */
interface FirstPageProps {
    onNext: () => void;
    formData: Record<string, any>;
    setFormData: (data: Record<string, any>) => void;
}

const FirstPage: React.FC<FirstPageProps> = ({ onNext, formData, setFormData }) => {
    /**
     * Handles input changes and updates formData state
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Box display="grid" gap={2}>
            <TextField fullWidth label="Title" name="title" value={formData.book_title} disabled InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Author(s)" name="authors" value={formData.authors || ''} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="ISBN10" name="isbn10" value={formData.isbn10} onChange={handleChange} />
            <TextField fullWidth label="ISBN13" name="isbn13" value={formData.isbn} onChange={handleChange} />
            <TextField fullWidth label="Categories" name="categories" value={formData.categories} onChange={handleChange} />
            <TextField fullWidth label="Call Number" name="callNumber" value={formData.callNumber} onChange={handleChange} />
            {/* <TextField fullWidth label="Accession Numbers" name="accessionNumbers" value={formData.accessionNumbers} onChange={handleChange} /> */}
            <TextField fullWidth label="Copyright" name="copyright" type="date" value={formData.copyright} onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true, }, }} />
            <TextField fullWidth label="Publisher" name="publisher" value={formData.publisher} onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true, }, }} />
            <TextField fullWidth label="Published Date" name="publishedDate" type="date" value={formData.publishedDate || ''} onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true, }, }} />
            <TextField fullWidth label="Pages" name="pages" value={formData.pages || ''} onChange={handleChange} type="number"
                slotProps={{ input: { inputMode: 'numeric' } }} />
            <TextField fullWidth label="Language" name="language" value={formData.language} onChange={handleChange} />

            <Button fullWidth variant="contained" color="primary" onClick={onNext}>
                Next Page
            </Button>
        </Box>
    );
};

export default FirstPage;
