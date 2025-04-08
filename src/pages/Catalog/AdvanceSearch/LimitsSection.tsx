import React, { useState } from "react";
import { Box, Grid2, TextField } from "@mui/material";
import SelectMenu from "../../../components/SelectMenu";

interface LimitsSectionProps {
    yearRange: string;
    language: string;
    setYearRange: (value: string) => void;
    setLanguage: (value: string) => void;
    setYearRangeError: (error: boolean) => void;
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

    const handleYearRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setYearRange(value);

        if (yearRangeRegex.test(value)) {
            setError(false); // Valid format
            setYearRangeError(false);
        } else {
            setError(true);
            setYearRangeError(true);
        }
    };

    const languageOptions = [
        { id: "No limit", name: "No limit" },
        { id: "english", name: "English" },
        { id: "filipino", name: "Filipino" },
        { id: "fr", name: "French" },
    ];

    return (
        <Box>
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 3 }}>
                    <TextField
                        label="Year"
                        placeholder="yyyy-yyyy"
                        value={yearRange}
                        onChange={handleYearRangeChange}
                        fullWidth
                        error={error}
                        helperText={error ? "Please enter a valid year range (yyyy-yyyy)." : ""}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 3 }}>
                    <SelectMenu
                        label="Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as string)}
                        options={languageOptions}
                        menuSize="medium"

                    />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default LimitsSection;