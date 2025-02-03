/* eslint-disable @typescript-eslint/no-explicit-any */
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
import UserService from '../../services/UserManagement/UserService';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { getBooksByAdvancedSearch } from '../../services/Cataloging/LocalBooksAPI';
import Z3950SRUSearch from '../Modal/SRUSearch/Z3950SRUSearch';

interface SearchBarProps {
  initialQuery?: string;
  initialSource?: string;
  onSearch: (books: Book[], source: string, query: string | object) => void;
  modalParams?: any;

}

const searchIndexLabels: { [key: string]: string } = {
  q: "Keyword",
  intitle: "Title",
  inauthor: "Author",
  inpublisher: "Publisher",
  insubjects: "Subject",
  isbn: "ISBN",
};

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '', initialSource = 'All libraries', onSearch, modalParams }) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchIndex, setSearchIndex] = useState("q");
  const [source, setSource] = useState(initialSource);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    keyword: '',
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    lccn: '',
  });

  useEffect(() => {
    setQuery(initialQuery);
    if (initialSource !== "Z39.50/SRU") {
      setSource(initialSource);
    }
  }, [initialQuery, initialSource]);


  const handleOpenSRUModal = () => {
    if (modalParams) {
      setFormDataFromParams(modalParams);
    }
    setModalOpen(true);
  };

  // Helper function to populate modal fields from modalParams
  const setFormDataFromParams = (params: any) => {
    const newFormData = {
      keyword: params.criteria?.find((criterion: any) => criterion.idx === "q")?.searchTerm || "",
      title: params.criteria?.find((criterion: any) => criterion.idx === "intitle")?.searchTerm || "",
      author: params.criteria?.find((criterion: any) => criterion.idx === "inauthor")?.searchTerm || "",
      publisher: params.criteria?.find((criterion: any) => criterion.idx === "inpublisher")?.searchTerm || "",
      isbn: params.criteria?.find((criterion: any) => criterion.idx === "isbn")?.searchTerm || "",
      lccn: "",
    };
    setFormData(newFormData);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      let result: Book[] = [];
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
      result = await getBooksByAdvancedSearch(advancedSearchParams);
      // Update the parent with the search results
      onSearch(result, source, advancedSearchParams);
      // Navigate to the BookSearch page with the search results
      navigate("/user/catalog/management/search-title", {
        state: { query: advancedSearchParams, books: result, source },
      });


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
                width: '700px', // Adjust the width here
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
                    <MenuItem value="eLibrary">Main Library</MenuItem>
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

        {UserService.adminOnly() && (
          <Button
            startIcon={<SearchIcon />}
            sx={{
              backgroundColor: "transparent",
              border: "none",
              textTransform: "none",
              boxShadow: "none",
              margin: 0,
              minWidth: "auto",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            onClick={handleOpenSRUModal}
          >
            Z39.50/SRU
          </Button>
        )}



        <Z3950SRUSearch
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={(books, source, query) => {
            onSearch(books, source, query);
          }}
          initialFormData={formData}
        />
      </Stack>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default SearchBar;
