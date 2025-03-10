import { Box, Typography, Divider } from "@mui/material";
import BookGrid from "../../Book/BookGrid";

const NewlyAcquiredBooks: React.FC = () => {
    return (
        <Box border="2px solid #EFF3EA" padding={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold">Newly Acquired Books</Typography>
                <Typography variant="caption" sx={{ cursor: "pointer", color: "#d32f2f" }}>
                    View More
                </Typography>
            </Box>

            <Divider sx={{ marginY: 1 }} />
            <BookGrid />
        </Box>
    );
};

export default NewlyAcquiredBooks;
