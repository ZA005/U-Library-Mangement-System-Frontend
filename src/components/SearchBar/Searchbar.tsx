import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, FormControl, Stack } from '@mui/material';
import { Book } from '../../model/Book';
import UserService from '../../services/UserService';
import styles from './styles.module.css';
import { searchGoogleBooks } from '../../services/Cataloging/GoogleBooksApi';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    initialQuery?: string;
    initialSource?: string;
    onSearch: (books: Book[], source: string, query: string | object) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '', initialSource = 'Main Library', onSearch }) => {
    const [query, setQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState(initialSource);
    const navigate = useNavigate();

    useEffect(() => {
        setQuery(initialQuery);
        setSource(initialSource);
    }, [initialQuery, initialSource]);




    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        if (!query.trim()) {
            setError('Please enter a search query.');
            setLoading(false);
            return;
        }

        try {
            let result: Book[] = [];
            if (source === 'Google Books') {
                // Call the Google Books API
                result = await searchGoogleBooks(query);
                navigate('/admin/catalog/management/search-title', { state: { query, books: result, source } });
                onSearch(result, source, query);
            }
            // else {
            //     // Call your local API for the search query
            //     const response = await getBooksByAdvancedSearch({ title: query });
            //     result = response || [];
            // }

            // onSearch(result, source, query);
        } catch (error) {
            console.error("Error fetching books:", error);
            setError('An error occurred while searching. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={styles.searchContainer}>
            <Stack direction="row" spacing={2} alignItems="center">
                <input
                    type="text"
                    placeholder="Search for a book..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.searchInput}
                />
                <FormControl variant="outlined" className={styles.sourceSelect}>
                    <select
                        id="source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        disabled={UserService.isUser()}
                        className={styles.sourceSelect}
                    >
                        <option value="Main Library">Main Library</option>
                        <option value="Google Books">Google Books</option>
                        {/* <option value="Library Of Congress">Library Of Congress</option> */}
                    </select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    disabled={loading || !query}
                    className={styles.searchButton}
                    endIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {loading ? 'Searching...' : 'Search'}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/user/advanced/search')}
                    className={styles.searchButton}
                >
                    Advanced Search
                </Button>
            </Stack>
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
};

export default SearchBar;
