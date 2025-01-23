import React from "react";
import { Box, Grid, TextField, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface LimitsSectionProps {
    yearRange: string;
    language: string;
    setYearRange: (value: string) => void;
    setLanguage: (value: string) => void;
}

const LimitsSection: React.FC<LimitsSectionProps> = ({
    yearRange,
    language,
    setYearRange,
    setLanguage,
}) => {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Year"
                        placeholder="yyyy-yyyy"
                        value={yearRange}
                        onChange={(e) => setYearRange(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <MenuItem value="No limit">No limit</MenuItem>
                            <MenuItem value="English">English</MenuItem>
                            <MenuItem value="French">French</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LimitsSection;
