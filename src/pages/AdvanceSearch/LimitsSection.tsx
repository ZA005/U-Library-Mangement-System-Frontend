import React, { useState } from "react";
import { Box, Grid, TextField, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface LimitsSectionProps {
    yearRange: string;
    language: string;
    setYearRange: (value: string) => void;
    setLanguage: (value: string) => void;
    setYearRangeError: (error: boolean) => void; // New prop to pass the error up
}

const LimitsSection: React.FC<LimitsSectionProps> = ({
    yearRange,
    language,
    setYearRange,
    setLanguage,
    setYearRangeError,
}) => {
    const [error, setError] = useState(false);

    // Regular expression to match the format "yyyy-yyyy"
    const yearRangeRegex = /^\d{4}-\d{4}$/;

    // Handle the year range change and validate format
    const handleYearRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setYearRange(value);

        // Validate the year range format
        if (yearRangeRegex.test(value)) {
            setError(false); // Valid format
            setYearRangeError(false); // Pass the error state up to parent
        } else {
            setError(true); // Invalid format
            setYearRangeError(true); // Pass the error state up to parent
        }
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Year"
                        placeholder="yyyy-yyyy"
                        value={yearRange}
                        onChange={handleYearRangeChange}
                        fullWidth
                        error={error}
                        helperText={error ? "Please enter a valid year range (yyyy-yyyy)." : ""}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <MenuItem value="No limit">No limit</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="fr">French</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LimitsSection;
