import { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import BookGrid from "../../Book/BookGrid";
import { useFetchAllBooks } from "./useFetchAllBooks";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";
import { useNavigate } from "react-router-dom";

const BrowseBooks: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: allBooks = [] } = useFetchAllBooks();
    const limitedBooks = allBooks?.slice(0, 6) || [];

    const navigate = useNavigate()
    return (
        <Box border="2px solid #EFF3EA" padding={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold">BROWSE Books</Typography>
                <Typography
                    variant="caption"
                    sx={{ cursor: "pointer", color: "#d32f2f" }}
                    onClick={() => navigate(PROTECTED_ROUTES.BROWSEALLBOOKS)}
                >
                    View More
                </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />

            {/* <CustomSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> */}
            <BookGrid searchQuery={searchQuery} books={limitedBooks} />
        </Box>
    );
};

export default BrowseBooks;
