/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Book } from "../../model/Book";
import BookList from "../../components/Book/BookList/BookListComponent";
import Header from "../../components/Header/Header";
import MenuIcon from "@mui/icons-material/Menu";
import Line from "../../components/Line/Line";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/SearchBar/Searchbar";
import { searchGoogleBooks } from "../../services/Cataloging/GoogleBooksApi";
import { getBooksByAdvancedSearch } from "../../services/Cataloging/LocalBooksAPI";

const BookSearch: React.FC = () => {
    const location = useLocation();
    const state = location.state as { query: any; books: Book[]; source: string };

    const [query, setQuery] = useState(state?.query || null);
    const [source, setSource] = useState(state?.source || "All libraries");
    const [books, setBooks] = useState<Book[]>(state?.books || []);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isNavigationSearch, setIsNavigationSearch] = useState(!!state?.query);

    const navigate = useNavigate();

    const handleSideBarClick = () => setSidebarOpen(!isSidebarOpen);
    const handleSidebarClose = () => setSidebarOpen(false);

    const handleBookClick = (book: Book) => {
        navigate(`/user/book/${book.id}`, {
            state: { book, searchState: { query, books, source } },
        });
    };

    const handleSearch = (newBooks: Book[], newSource: string, newQuery: string | object) => {
        setBooks(newBooks);
        setSource(newSource);
        setQuery(newQuery);
        setIsNavigationSearch(false); // Ensure subsequent searches are treated as user-triggered
    };
    // const updateBooks = (newBooks: Book[]) => {
    //     setBooks(newBooks);
    //     setSource(source);
    //     setQuery(query);
    //     setIsNavigationSearch(false);
    // };

    const fetchBooks = async (searchQuery: any, searchSource: string) => {
        setLoading(true);
        try {
            let result: Book[] = [];
            if (searchSource === "Google Books") {
                result = await searchGoogleBooks(searchQuery);
            } else if (searchSource !== "Google Books" && typeof searchQuery === "object") {
                result = await getBooksByAdvancedSearch(searchQuery);
            }
            setBooks(result);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isNavigationSearch && query) {
            fetchBooks(query, source);
        }
    }, [isNavigationSearch, query, source]); // Only fetch when it's a navigation search

    const generateSearchMessage = () => {
        const criteria =
            typeof query === "string"
                ? query
                : query?.criteria
                    ?.map((criterion: any) => {
                        if (criterion.idx === "q") {
                            return `inkeyword: ${criterion.searchTerm}`;
                        }
                        return `${criterion.idx}: ${criterion.searchTerm}`;
                    })
                    .join(" AND ");

        console.log('Books', books)

        if (books.length === 0) {
            return `No results match your search for ${criteria || "your query"} in ${source}.`;
        } else {
            return `${books.length} result(s) found for '${criteria || "your query"}' in ${source}.`;
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
                <SearchBar
                    initialQuery={typeof query === "string" ? query : ""}
                    initialSource={source}
                    onSearch={handleSearch}
                />
                {/* <SearchBar onSearch={updateBooks} /> */}

                {/* Display Search Results Summary */}
                {!loading && (
                    <Typography variant="h6" sx={{ marginBottom: 3 }}>
                        {generateSearchMessage()}
                    </Typography>
                )}

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : books.length === 0 ? (
                    <Typography>No results found</Typography>
                ) : (
                    <BookList books={books} onBookClick={handleBookClick} />
                )}
            </Container>
        </Box>
    );
};

export default BookSearch;
