import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, FormControl } from '@mui/material';
import UserService from '../../services/UserService';
import styles from './styles.module.css';
import { Book } from '../../model/Book';
import { searchGoogleBooks } from '../../services/Cataloging/GoogleBooksApi';

interface SearchBarProps {
    initialQuery?: string;
    initialSource?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '', initialSource = 'Main Library' }) => {
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
        let result: Book[] = [];
        try {
            if (source === 'Google Books') {

                result = await searchGoogleBooks(query);
            }
            // Add Library Of Congress logic if needed
            navigate('/admin/catalog/management/search-title', { state: { query, books: result, source } });
            console.error(error);
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
                    <option value="Library Of Congress">Library Of Congress</option>
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
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
};

export default SearchBar;
