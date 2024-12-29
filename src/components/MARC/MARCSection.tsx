import React from "react";
import { Box, Typography, TextField, Divider } from "@mui/material";

interface MARCSubfield {
    subfieldCode: string; // Subfield code ("a", "b", "c")
    label: string; // Subfield label
    placeholder?: string; // Optional placeholder text
    required?: boolean; // Optional required flag
}

interface MARCField {
    marcNumber: string; // MARC record number ("020", "245")
    marcName: string; // MARC record name ("International Standard Book Number")
    subfields: MARCSubfield[]; // List of subfields
}

interface MARCSectionProps {
    sectionNumber: number; // Section number (0, 1)
    marcFields: MARCField[]; // List of MARC fields within the section
    inputValues: { [key: string]: string };
    handleInputChange: (marcNumber: string, subfieldCode: string, value: string) => void;
}

const MARCSection: React.FC<MARCSectionProps> = ({ sectionNumber, marcFields, inputValues, handleInputChange }) => {
    return (
        <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
                Section {sectionNumber}
            </Typography>

            {marcFields.length > 0 ? (
                marcFields.map((field, fieldIndex) => (
                    <Box key={fieldIndex} mb={4}>
                        {/* MARC Field Header */}
                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                            {field.marcNumber} - {field.marcName}
                        </Typography>

                        {/* Subfields */}
                        {field.subfields.map((subfield, subfieldIndex) => {
                            const value = inputValues[`${field.marcNumber}-${subfield.subfieldCode}-${sectionNumber}`] || "";

                            return (
                                <Box key={subfieldIndex} display="flex" alignItems="center" mb={2}>
                                    {/* Subfield Code */}
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                        width="2rem"
                                        textAlign="center"
                                    >
                                        {subfield.subfieldCode}
                                    </Typography>

                                    {/* Field Label and Input */}
                                    <Box flex={1} ml={2}>
                                        <TextField
                                            fullWidth
                                            label={subfield.label}
                                            placeholder={subfield.placeholder}
                                            required={subfield.required}
                                            variant="outlined"
                                            size="small"
                                            value={value}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    field.marcNumber,
                                                    subfield.subfieldCode,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Box>
                                </Box>
                            );
                        })}
                        <Divider sx={{ mb: 2 }} />
                    </Box>
                ))
            ) : (
                <Typography variant="body1" color="textSecondary">
                    No fields available for this section. Please add the necessary fields.
                </Typography>
            )}
        </Box>
    );
};

export default MARCSection;
