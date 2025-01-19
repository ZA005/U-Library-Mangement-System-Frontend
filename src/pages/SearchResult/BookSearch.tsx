/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Book } from "../../model/Book";
import BookList from "../../components/Book/BookList/BookListComponent";
import Header from "../../components/Header/Header";
import MenuIcon from "@mui/icons-material/Menu";
import Line from "../../components/Line/Line";
import Sidebar from "../../components/Sidebar";

const BookSearch: React.FC = () => {
    const location = useLocation();
    const state = location.state as { query: any; books: Book[]; source: string };

    const [query] = useState(state?.query || {});
    const [source] = useState(state?.source || "Main Library");
    const [books] = useState<Book[]>(state?.books || []); // Store fetched books
    const [loading] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    // Function to handle the book click
    const handleBookClick = (book: Book) => {
        navigate(`/user/book/${book.id}`, {
            state: { book, searchState: { query, books, source } },
        });
    };

    // Generate dynamic message based on search results
    const generateSearchMessage = () => {
        const criteria = query.criteria
            ?.map((criterion: any) => `${criterion.idx}: ${criterion.searchTerm}`)
            .join(` ${query.criteria?.[0]?.operator || "AND"} `);

        if (books.length === 0) {
            return `No results match your search for ${criteria || "your criteria"} in ${source}.`;
        } else {
            return `${books.length} result(s) found for '${criteria || "your criteria"}' in ${source}.`;
        }
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header
                    buttons={
                        <>
                            <IconButton onClick={handleSideBarClick}>
                                <MenuIcon style={{ color: "#EA4040" }} />
                            </IconButton>
                        </>
                    }
                />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                        fontWeight="bold"
                    >
                        Catalog
                    </Typography>
                </Box>
                <Line />

                {/* Display Search Results Summary */}
                <Typography variant="h6" sx={{ marginBottom: 3 }}>
                    {generateSearchMessage()}
                </Typography>

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : books.length === 0 ? (
                    <Typography>No books match your search.</Typography>
                ) : (
                    <BookList books={books} onBookClick={handleBookClick} />
                )}
            </Container>
        </Box>
    );
};

export default BookSearch;
