import { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import BookGrid from "../../Book/BookGrid";
import { useFetchAllBooks } from "./useFetchAllBooks";

const BrowseBooks: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: allBooks = [] } = useFetchAllBooks();
    const limitedBooks = allBooks?.slice(0, 6) || [];

    return (
        <Box border="2px solid #EFF3EA" padding={2}>
            <Typography variant="h5" fontWeight="bold">Browse Books</Typography>
            <Divider sx={{ marginY: 1 }} />

            {/* <CustomSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> */}
            <BookGrid searchQuery={searchQuery} books={limitedBooks} />
        </Box>
    );
};

export default BrowseBooks;
