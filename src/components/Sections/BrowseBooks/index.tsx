import { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import BookGrid from "../../Book/BookGrid";
import { Books } from "../../../types";

interface BrowseBooksProps {
    books: Books[];
}
const BrowseBooks: React.FC<BrowseBooksProps> = ({ books }) => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Box border="2px solid #EFF3EA" padding={2}>
            <Typography variant="h5" fontWeight="bold">Browse Books</Typography>
            <Divider sx={{ marginY: 1 }} />

            <BookGrid searchQuery={searchQuery} books={books} limit={6} />
        </Box>
    );
};

export default BrowseBooks;
