import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import { Book } from '../../model/Book';
import UserService from '../../services/UserService';
import styles from './styles.module.css';
import { searchGoogleBooks } from '../../services/Cataloging/GoogleBooksApi';
import { useNavigate } from 'react-router-dom';
import { getBooksByAdvancedSearch } from '../../services/Cataloging/LocalBooksAPI';

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
  isbn: "ISBN",
};

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '', initialSource = 'All libraries', onSearch }) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchIndex, setSearchIndex] = useState("q");
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
      setError("Please enter a search query.");
      setLoading(false);
      return;
    }

    try {
      let result: Book[] = [];
      let formattedQuery: string | object;

      if (source === "Google Books") {
        formattedQuery = query;
        result = await searchGoogleBooks(query);
      } else {
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
        formattedQuery = advancedSearchParams;
        result = await getBooksByAdvancedSearch(advancedSearchParams);
      }

      navigate("/admin/catalog/management/search-title", {
        state: { query: formattedQuery, books: result, source },
      });

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
              sx={{
                width: '850px', // Adjust the width here
                maxWidth: '100%',
              }}
              InputProps={{
                startAdornment: <SearchIcon className={styles.searchIcon} />,
                endAdornment: (
                  <IconButton onClick={handleTuneClick}>
                    <TuneIcon className={styles.tuneIcon} />
                  </IconButton>
                ),
              }}
            />
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
                    {Object.entries(searchIndexLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
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
