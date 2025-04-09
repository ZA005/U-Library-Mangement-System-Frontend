import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, TextField, Button, Menu, MenuItem, FormControl, InputLabel, Select, IconButton } from "@mui/material";
import { ListFilter } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { searchIndexLabels } from "../../utils/searchIndexLabels";
import { useFetchAllLibraryLocations } from "../Book/BookForm/Location/useFetchLibraryLocations";
import SelectMenu from "../SelectMenu";
import { useFetchBookSearched } from "./useFetchBookSearched";
import { useNavigate, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "../../config/routeConfig";
import { Books } from "../../types";
import Z3950SRUSearch from "../Modal/SRUSearch/Z3950SRUSearch";
import { SearchParams } from "../../types/Catalog/SearchParams";

interface CustomSearchBarProps {
    initialQuery?: string;
    initialLibrary?: string;
    onSearch: (books: Books[], library: string, query: SearchParams) => void;
    modalParams?: {
        criteria?: { idx: string; searchTerm: string }[];
    };
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({ initialQuery = '', initialLibrary = 'All libraries', onSearch, modalParams }) => {
    const { role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchIndex, setSearchIndex] = useState("q");
    const [library, setLibrary] = useState(initialLibrary);
    const [query, setQuery] = useState(initialQuery);
    const { data: libraryLocations, isLoading } = useFetchAllLibraryLocations();
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
        if (modalParams?.criteria) {
            const newFormData = {
                keyword: modalParams.criteria.find(c => c.idx === "q")?.searchTerm || "",
                title: modalParams.criteria.find(c => c.idx === "intitle")?.searchTerm || "",
                author: modalParams.criteria.find(c => c.idx === "inauthor")?.searchTerm || "",
                publisher: modalParams.criteria.find(c => c.idx === "inpublisher")?.searchTerm || "",
                isbn: modalParams.criteria.find(c => c.idx === "isbn")?.searchTerm || "",
                lccn: modalParams.criteria.find(c => c.idx === "lccn")?.searchTerm || "",
            };
            setFormData(newFormData);
            setQuery(newFormData.keyword || newFormData.title);
            setSearchIndex(newFormData.title ? "intitle" : "q");
        }
    }, [modalParams]);

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => { setAnchorEl(null); };

    const handleOpenSRUModal = () => {
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const searchParams: SearchParams = useMemo(() => ({
        criteria: [
            {
                idx: searchIndex,
                searchTerm: query,
                operator: "AND",
            },
        ],
        library: library === "All libraries" ? undefined : library,
    }), [searchIndex, query, library]);

    const {
        isLoading: isSearching,
        refetch: refetchSearch,
    } = useFetchBookSearched(searchParams);

    const handleSearch = useCallback(async () => {
        try {
            const result = await refetchSearch();
            const updatedResults = result.data || [];

            onSearch(updatedResults, library, searchParams);

            navigate(PROTECTED_ROUTES.BROWSEALLBOOKS, {
                state: {
                    searchResults: updatedResults,
                    searchParams,
                    library,
                    acquisitionData: location.state?.acquisitionData
                },
            });
        } catch (error) {
            console.error("Search failed:", error);
            navigate(PROTECTED_ROUTES.BROWSEALLBOOKS, {
                state: {
                    searchResults: [],
                    query: "Search failed",
                    source: library,
                    acquisitionData: location.state?.acquisitionData
                },
            });
        }
    }, [refetchSearch, onSearch, library, searchParams, navigate, location.state]);

    useEffect(() => {
        if (modalParams && query) {
            handleSearch();
        }
    }, [modalParams, query, handleSearch]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={1} marginY={2} sx={{ flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" } }}>
            <Box sx={{ display: "flex", alignItems: "center", flex: 1, position: "relative" }}>
                <TextField
                    variant="outlined"
                    placeholder={`Search in ${searchIndexLabels[searchIndex]} at ${library}`}
                    fullWidth
                    size="small"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <IconButton onClick={handleFilterClick} sx={{ position: "absolute", right: 8 }}>
                    <ListFilter />
                </IconButton>
            </Box>

            <Button
                variant="contained"
                sx={{ backgroundColor: "#d32f2f" }}
                onClick={handleSearch}
                disabled={isSearching || !query}
            >
                {isSearching ? "Searching..." : "Search"}
            </Button>
            <Button variant="outlined" sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                onClick={() => navigate(PROTECTED_ROUTES.ADVANCESEARCH)}>
                Advanced Search
            </Button>

            {(role === "LIBRARIAN" || role === "LIBRARY DIRECTOR") && (
                <Button variant="text" sx={{ color: "#d32f2f" }} onClick={handleOpenSRUModal}>
                    Z39.50/SRU
                </Button>
            )}

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem>
                    <FormControl fullWidth>
                        <InputLabel id="search-index">Search Index</InputLabel>
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
                </MenuItem>

                <MenuItem>
                    <FormControl fullWidth>
                        <SelectMenu
                            label="Library"
                            value={library}
                            onChange={(e) => setLibrary(e.target.value as string)}
                            options={[
                                { id: "All libraries", name: "All libraries" },
                                ...(libraryLocations?.filter((loc) => loc.status)
                                    .map((loc) => ({ id: loc.name, name: loc.name })) || []),
                            ]}
                            disabled={isLoading}
                        />
                    </FormControl>
                </MenuItem>
            </Menu>
            <Z3950SRUSearch
                open={modalOpen}
                onClose={handleCloseModal}
                onSubmit={(books, source, query) => {
                    onSearch(books, source, query);
                }}
                initialFormData={formData}
            />
        </Box>
    );
};

export default CustomSearchBar;