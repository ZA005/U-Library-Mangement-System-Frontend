import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface SortingSectionProps {
    sortOrder: string;
    setSortOrder: (value: string) => void;
}

const SortingSection: React.FC<SortingSectionProps> = ({ sortOrder, setSortOrder }) => {
    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <MenuItem value="Acquisition date: newest to oldest">
                        Acquisition date: newest to oldest
                    </MenuItem>
                    <MenuItem value="Acquisition date: oldest to newest">
                        Acquisition date: oldest to newest
                    </MenuItem>
                    <MenuItem value="Title A-Z">Title A-Z</MenuItem>
                    <MenuItem value="Title Z-A">Title Z-A</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default SortingSection;
