/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, TextField, Button } from "@mui/material";
import { useFetchCallNumber } from "./useFetchCallNumber";

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

    const getAuthorsArray = (authors) => {
        if (!authors) return [];

        // If authors is already a string, split it
        if (typeof authors === 'string') {
            return authors.split(",");
        }

        // If authors is an array of objects, get first author's name
        if (Array.isArray(authors) && authors.length > 0) {
            const firstAuthor = authors[0];
            return [typeof firstAuthor === 'string' ? firstAuthor : firstAuthor?.name || ""];
        }

        return [];
    };

    // Use the useFetchCallNumber hook
    const { isLoading, refetch } = useFetchCallNumber(
        formData.book_title || formData.title || "",
        formData.categories || "",
        getAuthorsArray(formData.authors),
        formData.published_date || formData.publishedDate || ""
    );

    // Function to handle generating the call number
    const handleGenerateCallNumber = async () => {
        const result = await refetch(); // Wait for the refetch to complete
        if (result.data) {
            setFormData({ ...formData, callNumber: result.data });
        }
    };
    // Get display value for authors
    const getAuthorsDisplayValue = (authors) => {
        if (!authors) return '';

        if (typeof authors === 'string') {
            return authors; // Return as-is if it's already a string
        }

        if (Array.isArray(authors) && authors.length > 0) {
            // Map through all authors and extract names, then join them
            return authors
                .map(author => typeof author === 'string' ? author : author?.name || '')
                .filter(name => name) // Remove empty entries
                .join(', ');
        }

        return '';
    };

    return (
        <Box display="grid" gap={2}>
            <TextField fullWidth label="Title" name="title" value={formData.book_title || formData.title || ''} disabled
                slotProps={{ inputLabel: { shrink: true } }} />
            <TextField fullWidth label="Author(s)" name="authors" value={getAuthorsDisplayValue(formData.authors)}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
            />
            <Box display="flex" gap={2}>
                <TextField fullWidth label="ISBN13" name="isbn13" value={formData.isbn || formData.isbn13} onChange={handleChange} />
                <TextField fullWidth label="ISBN10" name="isbn10" value={formData.isbn10} onChange={handleChange} />
            </Box>

            <TextField fullWidth label="Copyright" name="copyright" type="number" value={formData.copyright || ""} onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true }, input: { inputProps: { min: 1000, max: new Date().getFullYear(), }, }, }} />
            <TextField fullWidth label="Publisher" name="publisher" value={formData.publisher} onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }} />
            <TextField fullWidth label="Published Date" name="publishedDate" type="date" value={formData.published_date || formData.publishedDate || ''} onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }} />
            <Box display="flex" gap={2}>
                <TextField fullWidth label="Edition" name="edition" value={formData.edition}
                    onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} />
                <TextField fullWidth label="Series" name="series" value={formData.series}
                    onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} />
            </Box>
            <Box display="flex" gap={2}>
                <TextField fullWidth label="Categories" name="categories" value={formData.categories}
                    onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} />
                <Button variant="outlined" color="primary" onClick={handleGenerateCallNumber} disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Call Number"}
                </Button>
            </Box>

            <TextField fullWidth label="Call Number" name="callNumber" value={formData.callNumber} onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }} />
            <TextField fullWidth label="Description" name="description" value={formData.description || ''} onChange={handleChange}
                multiline rows={3} slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField fullWidth label="Pages" name="pages" value={formData.pages || ''} onChange={handleChange} type="number"
                slotProps={{ input: { inputMode: 'numeric' } }} />
            <TextField fullWidth label="Print Type" name="printType" value={formData.printType} onChange={handleChange} />
            <TextField fullWidth label="Format" name="format" value={formData.format} onChange={handleChange} />
            <TextField fullWidth label="Language" name="language" value={formData.language} onChange={handleChange} />

            <Button fullWidth variant="contained" color="primary" onClick={onNext}>
                Next Page
            </Button>
        </Box>
    );
};

export default FirstPage;