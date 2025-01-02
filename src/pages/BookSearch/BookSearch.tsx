import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Import MenuIcon
import Sidebar from '../../components/Sidebar'; // Import Sidebar
import { searchGoogleBooks } from '../../services/GoogleBooksApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BookList from '../../components/BookList/BookListComponent';
import searchLibraryOfCongress from '../../services/LibraryOfCongressApi';
import UserService from '../../services/UserService';
import { Book } from '../../model/Book';
import Header from '../../components/Header/Header';
import Line from '../../components/Line/Line';
import Copyright from '../../components/Footer/Copyright';
import styles from './styles.module.css';

const BookSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState('Main Library');
    const { role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // State for Sidebar
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    useEffect(() => {
        if (location.state?.searchState) {
            const { query, books } = location.state.searchState;
            setQuery(query);
            setBooks(books);
        }
    }, [location.state]);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        if (!query.trim()) {
            setError('Please enter a search query.');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token is missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            let result: Book[] = [];
            if (source === 'Main Library') {
                // result = await searchMainLibrary(query);
            } else if (source === 'Google Books') {
                result = await searchGoogleBooks(query, token);
            } else if (source === 'Library Of Congress') {
                result = await searchLibraryOfCongress(query, token);
            }
            setBooks(result);
        } catch (err) {
            setError(`Failed to fetch books from ${source}. Please try again.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookClick = (book: Book) => {
        navigate(`/user/book/${book.id}`, {
            state: { book, searchState: { query, books } },
        });
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            {/* Add Sidebar */}
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header
                    buttons={
                        <>
                            {/* Add Hamburger Menu */}
                            <IconButton onClick={handleSideBarClick}>
                                <MenuIcon style={{ color: "#EA4040" }} />
                            </IconButton>
                        </>
                    }
                />
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                    fontWeight="bold"
                >
                    Welcome, To BookSearch LIBRARIAN!
                </Typography>
                <Line />

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search for a book..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <select
                        id="source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        disabled={UserService.isUser()}
                        className={styles.sourceSelect}
                    >
                        <option value="Main Library">Main Library</option>
                        {UserService.isAdmin() && (
                            <>
                                <option value="Google Books">Google Books</option>
                                <option value="Library Of Congress">Library Of Congress</option>
                            </>
                        )}
                    </select>
                    <button
                        onClick={handleSearch}
                        disabled={loading || !query}
                        className={styles.searchButton}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {error && <Typography color="error">{error}</Typography>}

                {books.length === 0 ? (
                    <Typography>No books available.</Typography>
                ) : (
                    <BookList books={books} onBookClick={handleBookClick} />
                )}
            </Container>
            <Copyright />
        </Box>
    );
};

export default BookSearch;
