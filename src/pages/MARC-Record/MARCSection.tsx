import React, { forwardRef } from "react";
import { Box, Typography, Divider } from "@mui/material";
import MARCField from "./MARCField";

interface MARCSectionProps {
    section: {
        sectionNumber: number;
        marcFields: {
            marcNumber: string;
            marcName: string;
            subfields: {
                subfieldCode: string;
                label: string;
                required: boolean;
            }[];
        }[];
    };
    inputValues: { [key: string]: string };
    onInputChange: (marcNumber: string, subfieldCode: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MARCSection = forwardRef<HTMLDivElement, MARCSectionProps>(({ section, inputValues, onInputChange }, ref) => (
    <Box ref={ref} style={{ marginBottom: "2rem" }}>
        <Typography variant="h6" gutterBottom>Section {section.sectionNumber}</Typography>
        {section.marcFields.map(field => (
            <MARCField key={field.marcNumber} {...field} inputValues={inputValues} onInputChange={onInputChange} />
        ))}
        <Divider sx={{ my: 2 }} />
    </Box>
));

export default MARCSection;
