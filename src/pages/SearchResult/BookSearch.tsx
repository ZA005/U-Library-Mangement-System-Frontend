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
import { getBooksByAdvancedSearch } from "../../services/Cataloging/LocalBooksAPI";

const BookSearch: React.FC = () => {
    const location = useLocation();
    const state = location.state as { query: any; books: Book[]; source: string; modalParams?: any };

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
            state: { book, searchState: { query, books, source }, source },
        });
    };

    const handleSearch = (newBooks: Book[], newSource: string, newQuery: string | object) => {
        setBooks(newBooks);
        setSource(newSource);
        setQuery(newQuery);
        setIsNavigationSearch(false);
    };


    const fetchBooks = async (searchQuery: any, searchSource: string) => {
        setLoading(true);
        try {
            let result: Book[] = [];
            if (searchSource !== "Z39.50/SRU" && typeof searchQuery === "object") {
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
        // Start building the criteria message
        const criteria = [];

        // Check if query is a string, if so, use it directly
        if (typeof query === "string") {
            criteria.push(query);
        } else {
            // Add filtered criteria (ignore null, isAvailableOnly, and sortOrder)
            query?.criteria?.forEach((criterion: any) => {
                if (criterion.searchTerm !== null && criterion.idx !== "isAvailableOnly" && criterion.idx !== "sortOrder") {
                    if (criterion.idx === "q") {
                        criteria.push(`inkeyword: ${criterion.searchTerm}`);
                    } else {
                        criteria.push(`${criterion.idx}: ${criterion.searchTerm}`);
                    }
                }
            });

            // Add other relevant fields if they have values
            if (query?.yearRange) {
                criteria.push(`yearRange: ${query.yearRange}`);
            }
            if (query?.language) {
                criteria.push(`language: ${query.language}`);
            }
            if (query?.itemType?.length > 0) {
                criteria.push(`itemType: ${query.itemType.join(", ")}`);
            }
            if (query?.sections?.length > 0) {
                criteria.push(`sections: ${query.sections.join(", ")}`);
            }
            if (query?.collection) {
                criteria.push(`collection: ${query.collection}`);
            }
        }

        const criteriaString = criteria.join(" AND ");

        // Return the result message
        if (books.length === 0) {
            return `No results match your search for ${criteriaString || "your query"} in ${source}.`;
        } else {
            return `${books.length} result(s) found for '${criteriaString || "your query"}' in ${source}.`;
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
                    modalParams={state?.modalParams}
                />

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
                    <BookList books={books} onBookClick={handleBookClick} source={source} />
                )}
            </Container>
        </Box>
    );
};

export default BookSearch;
