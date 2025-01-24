import React from "react";
import { TextField, Typography, Box } from "@mui/material";

interface MARCFieldProps {
    marcNumber: string;
    marcName: string;
    subfields: {
        subfieldCode: string;
        label: string;
        required: boolean;
    }[];
    inputValues: { [key: string]: string };
    onInputChange: (marcNumber: string, subfieldCode: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MARCField: React.FC<MARCFieldProps> = ({ marcNumber, marcName, subfields, inputValues, onInputChange }) => (
    <Box key={marcNumber}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{marcNumber} - {marcName}</Typography>
        {subfields.map(subfield => (
            <Box key={`${marcNumber}-${subfield.subfieldCode}`} display="flex" alignItems="center" mb={1}>
                <Typography variant="body1" ml={1} paddingRight="10px">{subfield.subfieldCode}</Typography>
                <TextField
                    label={`${subfield.label}`}
                    value={inputValues[`${marcNumber}-${subfield.subfieldCode}`] || ''}
                    onChange={onInputChange(marcNumber, subfield.subfieldCode)}
                    fullWidth
                    margin="normal"
                    required={subfield.required}
                />
            </Box>
        ))}
    </Box>
);

export default MARCField;