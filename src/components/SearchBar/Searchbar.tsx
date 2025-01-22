import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, Menu, MenuItem, Select, Stack, TextField } from '@mui/material';
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import { Book } from '../../model/Book';
import UserService from '../../services/UserService';
import styles from './styles.module.css';
import { searchGoogleBooks } from '../../services/Cataloging/GoogleBooksApi';
import { useNavigate } from 'react-router-dom';
import { getBooksByAdvancedSearch } from '../../services/Cataloging/LocalBooksAPI';
// import Z3950SRUSearch from '../Modal/SRUSearch/Z3950SRUSearch';

interface SearchBarProps {
    initialQuery?: string;
    initialSource?: string;
    onSearch: (books: Book[], source: string, query: string | object) => void;
}

const searchIndexLabels: { [key: string]: string } = {
    q: "Keyword",
    intitle: "Title",
    inauthor: "Author",
    inpublisher: "Publisher",
    insubjects: "Subject",
    isbn: "ISBN"
};

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '', initialSource = 'All libraries', onSearch }) => {
    const [query, setQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchIndex, setSearchIndex] = useState("q");
    // const [library, setLibrary] = useState("All libraries");
    const [source, setSource] = useState(initialSource);
    const navigate = useNavigate();
    // const [modalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        setQuery(initialQuery);
        setSource(initialSource);
    }, [initialQuery, initialSource]);


    // To be implemented if still have time
    // const handleOpenSRUModal = () => {
    //     setModalOpen(true);
    // };

    // const handleCloseModal = () => {
    //     setModalOpen(false);
    // };
    // const handleFormSubmit = (formData: any) => {
    //     console.log("Form Data Submitted:", formData);
    //     // Handle the form data here, e.g., make API request or filter books
    // };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        if (!query.trim()) {
            setError("Please enter a search query.");
            setLoading(false);
            return;
        }

        try {
            let result: Book[] = [];
            let formattedQuery: string | object;

            if (source === "Google Books") {
                // Simple query for Google Books
                formattedQuery = query; // Just pass the string query
                result = await searchGoogleBooks(query);
            } else {
                // Advanced search for other libraries
                const advancedSearchParams = {
                    criteria: [
                        {
                            idx: searchIndex,
                            searchTerm: query,
                            operator: "AND",
                        },
                    ],
                    individualLibrary: source === "All libraries" ? null : source,
                };
                formattedQuery = advancedSearchParams; // Pass advanced query parameters
                result = await getBooksByAdvancedSearch(advancedSearchParams);
            }

            // Navigate to the BookSearch page with the search results
            navigate("/admin/catalog/management/search-title", {
                state: { query: formattedQuery, books: result, source },
            });

            // Update the parent with the search results
            onSearch(result, source, formattedQuery);
        } catch (error) {
            console.error("Error fetching books:", error);
            setError("An error occurred while searching. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const handleTuneClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={styles.searchContainer}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box className={styles.actionBar}>
                    <Box className={styles.searchBox}>
                        <TextField
                            placeholder={`Search in ${searchIndexLabels[searchIndex]} at ${source || "All libraries"}`}
                            type="text"
                            size="small"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon className={styles.searchIcon} />
                                ),
                                endAdornment: (
                                    <IconButton onClick={handleTuneClick}>
                                        <TuneIcon className={styles.tuneIcon} />
                                    </IconButton>
                                ),
                            }}
                        />
                        {/* Dropdown for filter options */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <Box sx={{ padding: 2, width: 200 }}>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Search Index</InputLabel>
                                    <Select
                                        label="Search Index"
                                        disabled={UserService.isUser()}
                                        value={searchIndex || "q"}
                                        onChange={(e) => setSearchIndex(e.target.value)}
                                    >
                                        <MenuItem value="q">Keyword</MenuItem>
                                        <MenuItem value="intitle">Title</MenuItem>
                                        <MenuItem value="inauthor">Author</MenuItem>
                                        <MenuItem value="inpublisher">Publisher</MenuItem>
                                        <MenuItem value="insubjects">Subject</MenuItem>
                                        <MenuItem value="isbn">ISBN</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Library</InputLabel>
                                    <Select
                                        label="Source"
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                    >
                                        <MenuItem value="All libraries">All libraries</MenuItem>
                                        <MenuItem value="Google Books">Google Books</MenuItem>
                                        <MenuItem value="eLibrary">eLibrary</MenuItem>
                                        <MenuItem value="Graduate Studies Library">Graduate Studies Library</MenuItem>
                                        <MenuItem value="Law Library">Law Library</MenuItem>
                                        <MenuItem value="Engineering and Architecture Library">Engineering and Architecture Library</MenuItem>
                                        <MenuItem value="High School Library">High School Library</MenuItem>
                                        <MenuItem value="Elementary Library">Elementary Library</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Menu>
                    </Box>

                </Box>
                {/* <Box>
                    <input
                        type="text"
                        placeholder="Search for a book..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={styles.searchInput}
                    />
                    <IconButton>
                        <TuneIcon className={styles.tuneIcon} />
                    </IconButton>
                </Box> */}

                {/* <FormControl variant="outlined" className={styles.sourceSelect}>
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
                </FormControl> */}

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

                {/* To be implemented */}
                {/* <Button
                    startIcon={<SearchIcon />}
                    sx={{
                        color: "inherit",
                        backgroundColor: "transparent",
                        border: "none",
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                    }}
                    onClick={handleOpenSRUModal}
                >
                    Z39.50/SRU
                </Button>

                <Z3950SRUSearch
                    open={modalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleFormSubmit}
                /> */}
            </Stack>
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
};

export default SearchBar;
