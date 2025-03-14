import { useState } from "react";
import { Box, TextField, Button, Menu, MenuItem, FormControl, InputLabel, Select, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useAuth } from "../../contexts/AuthContext";

interface CustomSearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    const { role } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchIndex, setSearchIndex] = useState("Title");
    const [library, setLibrary] = useState("Main Library");

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box display="flex" alignItems="center" gap={1} marginY={2} sx={{ flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" } }}>
            {/* Search Input with Filter Icon */}
            <Box sx={{ display: "flex", alignItems: "center", flex: 1, position: "relative" }}>
                <TextField
                    variant="outlined"
                    placeholder="Search for books..."
                    fullWidth
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton onClick={handleFilterClick} sx={{ position: "absolute", right: 8 }}>
                    <FilterListIcon />
                </IconButton>
            </Box>

            {/* Buttons */}
            <Button variant="contained" sx={{ backgroundColor: "#d32f2f" }}>Search</Button>
            <Button variant="outlined" sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}>Advanced Search</Button>

            {(role === "LIBRARIAN" || role === "LIBRARY DIRECTOR") && (
                <Button variant="text" sx={{ color: "#d32f2f" }}>Z39.50/50</Button>
            )}

            {/* Filter Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem>
                    <FormControl fullWidth>
                        <InputLabel>Search Index</InputLabel>
                        <Select value={searchIndex} onChange={(e) => setSearchIndex(e.target.value)}>
                            <MenuItem value="Title">Title</MenuItem>
                            <MenuItem value="Author">Author</MenuItem>
                            <MenuItem value="Publisher">Publisher</MenuItem>
                            <MenuItem value="Subject">Subject</MenuItem>
                            <MenuItem value="ISBN">ISBN</MenuItem>
                        </Select>
                    </FormControl>
                </MenuItem>

                <MenuItem>
                    <FormControl fullWidth>
                        <InputLabel>Library</InputLabel>
                        <Select value={library} onChange={(e) => setLibrary(e.target.value)}>
                            <MenuItem value="Main Library">Main Library</MenuItem>
                            <MenuItem value="Graduate Studies">Graduate Studies</MenuItem>
                            <MenuItem value="Law Library">Law Library</MenuItem>
                        </Select>
                    </FormControl>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default CustomSearchBar;
