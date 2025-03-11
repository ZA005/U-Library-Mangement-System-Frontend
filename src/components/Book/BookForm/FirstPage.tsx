import { Box, TextField, Button } from "@mui/material";

interface FirstPageProps {
    onNext: () => void;
}

const FirstPage: React.FC<FirstPageProps> = ({ onNext }) => {
    return (
        <Box display="grid" gap={2}>
            <TextField fullWidth label="Title" name="title" />
            <TextField fullWidth label="Author(s)" name="authors" />
            <TextField fullWidth label="ISBN10" name="isbn10" />
            <TextField fullWidth label="ISBN13" name="isbn13" />
            <TextField fullWidth label="Call Number" name="callNumber" />
            <TextField fullWidth label="Accession Numbers" name="accessionNumbers" />
            <TextField fullWidth label="Copyright" name="copyright" />
            <TextField fullWidth label="Publisher" name="publisher" />
            <TextField fullWidth label="Published Date" name="publishedDate" />
            <TextField fullWidth label="Pages" name="pages" />
            <TextField fullWidth label="Language" name="language" />
            <TextField fullWidth label="Categories" name="categories" />

            {/* Next Page Button */}
            <Button fullWidth variant="contained" color="primary" onClick={onNext}>
                Next Page
            </Button>
        </Box>
    );
};

export default FirstPage;
