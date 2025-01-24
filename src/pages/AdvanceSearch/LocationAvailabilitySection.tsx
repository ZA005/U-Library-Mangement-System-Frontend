import React from "react";
import { Box, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select } from "@mui/material";

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
    return (
        <Box>
            <FormControlLabel
                control={
                    <Checkbox checked={isAvailableOnly} onChange={(e) => setIsAvailableOnly(e.target.checked)} />
                }
                label="Only items currently available"
            />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Individual Libraries</InputLabel>
                        <Select value={individualLibrary} onChange={(e) => setIndividualLibrary(e.target.value)}>
                            <MenuItem value="All libraries">All libraries</MenuItem>
                            <MenuItem value="eLibrary">E-Library</MenuItem>
                            <MenuItem value="Graduate Studies Library">Graduate Studies Library</MenuItem>
                            <MenuItem value="Law Library">Law Library</MenuItem>
                            <MenuItem value="Engineering and Architecture Library">Engineering and Architecture Library</MenuItem>
                            <MenuItem value="High School Library">High School Library</MenuItem>
                            <MenuItem value="Elementary Library">Elementary Library Library</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LocationAvailabilitySection;
