import { useState } from "react";
import { Box, TextField, Button, Menu, MenuItem, FormControl, InputLabel, Select, IconButton } from "@mui/material";
import { ListFilter } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { searchIndexLabels } from "../../utils/searchIndexLabels";
import { useFetchAllLibraryLocations } from "../Book/BookForm/Location/useFetchLibraryLocations";
import SelectMenu from "../SelectMenu";

interface CustomSearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    const { role } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchIndex, setSearchIndex] = useState("q");
    const [library, setLibrary] = useState("All libraries");

    const { data: libraryLocations, isLoading } = useFetchAllLibraryLocations();

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => { setAnchorEl(null); };

    return (
        <Box display="flex" alignItems="center" gap={1} marginY={2} sx={{ flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" } }}>
            {/* Search Input with Filter Icon */}
            <Box sx={{ display: "flex", alignItems: "center", flex: 1, position: "relative" }}>
                <TextField
                    variant="outlined"
                    placeholder={`Search in ${searchIndexLabels[searchIndex]} at ${library}`}
                    fullWidth
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton onClick={handleFilterClick} sx={{ position: "absolute", right: 8 }}>
                    <ListFilter />
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
        </Box>
    );
};

export default CustomSearchBar;
