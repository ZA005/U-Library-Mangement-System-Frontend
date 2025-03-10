import { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import BookGrid from "../../Book/BookGrid";
import CustomSearchBar from "../../CustomSearchBar";

const BrowseBooks: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Box border="2px solid #EFF3EA" padding={2}>
            <Typography variant="h5" fontWeight="bold">Browse Books</Typography>
            <Divider sx={{ marginY: 1 }} />

            <CustomSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <BookGrid searchQuery={searchQuery} />
        </Box>
    );
};

export default BrowseBooks;
