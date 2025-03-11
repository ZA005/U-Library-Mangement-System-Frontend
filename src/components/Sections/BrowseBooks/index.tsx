import { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import BookGrid from "../../Book/BookGrid";
import { Books } from "../../../types";
// import CustomSearchBar from "../../CustomSearchBar";

// WHEN THE DATA IS READY UPDATE THIS COMPONENT TO ACCEPT PROPS WHICH ARE THE BOOKS
// THEN PASS IT ON TO THE BOOK GRID TO RENDER THOSE BOOKS

interface BrowseBooksProps {
    books: Books[];
}
const BrowseBooks: React.FC<BrowseBooksProps> = ({ books }) => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Box border="2px solid #EFF3EA" padding={2}>
            <Typography variant="h5" fontWeight="bold">Browse Books</Typography>
            <Divider sx={{ marginY: 1 }} />

            {/* <CustomSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> */}
            <BookGrid searchQuery={searchQuery} books={books} />
        </Box>
    );
};

export default BrowseBooks;
