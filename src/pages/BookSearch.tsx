import React, { useState, useEffect } from 'react';
import { searchGoogleBooks } from '../services/GoogleBooksApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BookList from '../components/BookList/BookListComponent';
import searchLibraryOfCongress from '../services/LibraryOfCongressApi';
import UserService from '../services/UserService';

interface Book {
    id: string;
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    isbn10?: string;
    isbn13?: string;
    thumbnail: string;
}

const BookSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState('Main Library');
    const { role, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Restore search results and query if coming back from BookDetails
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
        //Get the token of the librarian
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
        // Pass search state to BookDetails for returning to this page
        navigate(`/user/book/${book.id}`, {
            state: { book, searchState: { query, books } },
        });
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div>
            <div>
                {role ? (
                    <h2>Welcome, {role}!</h2>
                ) : (
                    <h2>Welcome, Guest!</h2>
                )}
            </div>

            <h1>Book Search</h1>

            <div>
                <label htmlFor="source" style={{ marginRight: '10px' }}>Select Source:</label>
                <select
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    disabled={UserService.isUser()}
                    style={{ padding: '8px', marginBottom: '10px', width: '200px' }}
                >
                    <option value="Main Library">Main Library</option>
                    {UserService.isAdmin() && <option value="Google Books">Google Books</option>}
                    {UserService.isAdmin() && <option value="Library Of Congress">Library Of Congress</option>}
                </select>
            </div>

            <input
                type="text"
                placeholder="Search for a book..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ padding: '8px', marginBottom: '10px', width: '300px' }}
            />
            <button
                onClick={handleSearch}
                disabled={loading || !query}
                style={{ padding: '8px 16px', marginRight: '10px' }}
            >
                {loading ? 'Searching...' : 'Search'}
            </button>

            {isAuthenticated && (
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'red',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    Logout
                </button>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <BookList books={books} onBookClick={handleBookClick} />
        </div>
    );
};

export default BookSearch;
