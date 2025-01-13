import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Book } from '../../model/Book';
import BookList from '../../components/Book/BookList/BookListComponent';
import Header from '../../components/Header/Header';
import Line from '../../components/Line/Line';
import SearchBar from '../../components/SearchBar/Searchbar';
import { searchGoogleBooks } from '../../services/Cataloging/GoogleBooksApi';

const BookSearch: React.FC = () => {
    const location = useLocation();
    const state = location.state as { query: string; books: Book[]; source: string };

    const [query] = useState(state?.query || '');
    const [source] = useState(state?.source || 'Main Library');
    const [books, setBooks] = useState<Book[]>(state?.books || []);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            if (query.trim() && source === 'Google Books') {
                setLoading(true);
                try {
                    const result = await searchGoogleBooks(query);
                    setBooks(result);
                } catch (error) {
                    console.error('Error fetching books:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        // Automatically trigger the search if the query and source are provided.
        if (state && state.query && state.source) {
            fetchBooks();
        }
    }, [state, query, source]);

    const handleBookClick = (book: Book) => {
        navigate(`/user/book/${book.id}`, {
            state: { book, searchState: { query, books, source } },
        });
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header buttons={<></>} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ fontSize: { xs: '1.8rem', sm: '2rem', md: '2.4rem' } }}
                        fontWeight="bold"
                    >
                        Catalog
                    </Typography>
                </Box>
                <Line />
                <SearchBar initialQuery={query} initialSource={source} />

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : books.length === 0 ? (
                    <Typography>No books found for "{query}".</Typography>
                ) : (
                    <BookList books={books} onBookClick={handleBookClick} />
                )}
            </Container>
        </Box>
    );
};

export default BookSearch;
