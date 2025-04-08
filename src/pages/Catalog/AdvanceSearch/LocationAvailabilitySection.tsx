import React from "react";
import { Box, Checkbox, FormControl, FormControlLabel, Grid2 } from "@mui/material";
import { useFetchAllLibraryLocations } from "../../../components/Book/BookForm/Location/useFetchLibraryLocations";
import SelectMenu from "../../../components/SelectMenu";


interface LocationAvailabilitySectionProps {
    isAvailableOnly: boolean;
    individualLibrary: string;
    setIsAvailableOnly: (value: boolean) => void;
    setIndividualLibrary: (value: string) => void;
}

const LocationAvailabilitySection: React.FC<LocationAvailabilitySectionProps> = ({
    isAvailableOnly,
    individualLibrary,
    setIsAvailableOnly,
    setIndividualLibrary,
}) => {
    const { data: libraryLocations, isLoading } = useFetchAllLibraryLocations();
    return (
        <Box>
            <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isAvailableOnly}
                                onChange={(e) => setIsAvailableOnly(e.target.checked)}
                            />
                        }
                        label="Only items currently available"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="outlined">
                        <SelectMenu
                            label="Library Locations"
                            value={individualLibrary}
                            menuSize="medium"
                            onChange={(e) => setIndividualLibrary(e.target.value as string)}
                            options={[
                                { id: "All libraries", name: "All libraries" },
                                ...(libraryLocations?.filter((loc) => loc.status)
                                    .map((loc) => ({ id: loc.name, name: loc.name })) || []),
                            ]}
                            disabled={isLoading}
                        />
                    </FormControl>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default LocationAvailabilitySection;