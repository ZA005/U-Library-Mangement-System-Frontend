import React from "react";
import { Box } from "@mui/material";
import SelectMenu from "../../../components/SelectMenu";

interface SortingSectionProps {
    sortOrder: string;
    setSortOrder: (value: string) => void;
}

const SortingSection: React.FC<SortingSectionProps> = ({ sortOrder, setSortOrder }) => {
    const sortOptions = [
        { id: "Acquisition date: newest to oldest", name: "Acquisition date: newest to oldest" },
        { id: "Acquisition date: oldest to newest", name: "Acquisition date: oldest to newest" },
        { id: "Title A-Z", name: "Title A-Z" },
        { id: "Title Z-A", name: "Title Z-A" },
    ];

    return (
        <Box>
            <SelectMenu
                label="Sort by"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as string)}
                options={sortOptions}
                menuSize="medium"
            />
        </Box>
    );
};

export default SortingSection;