import React from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SearchCriteria {
    idx: string;
    searchTerm: string;
    operator: string;
}

interface CriteriaSectionProps {
    criteria: SearchCriteria[];
    setCriteria: (newCriteria: SearchCriteria[]) => void;
}

const CriteriaSection: React.FC<CriteriaSectionProps> = ({ criteria, setCriteria }) => {
    const handleCriteriaChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ value: unknown }> | SelectChangeEvent<string>,
        index: number,
        field: string
    ) => {
        const updatedCriteria = [...criteria];
        updatedCriteria[index] = { ...updatedCriteria[index], [field]: e.target.value };
        setCriteria(updatedCriteria);
    };

    const handleAddCriterion = () => {
        setCriteria([...criteria, { idx: "q", searchTerm: "", operator: "AND" }]);
    };

    const handleRemoveCriterion = (index: number) => {
        if (criteria.length > 1) {
            const updatedCriteria = criteria.filter((_, i) => i !== index);
            setCriteria(updatedCriteria);
        }
    };

    return (
        <>
            {criteria.map((param, index) => (
                <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    marginBottom={2}
                    padding={2}
                    borderRadius={2}
                    border="1px solid #ddd"
                    sx={{ backgroundColor: "#f9f9f9" }}
                >
                    {/* Logical operator dropdown */}
                    {index > 0 && (
                        <FormControl sx={{ marginRight: 2, minWidth: 120 }}>
                            <InputLabel>Operator</InputLabel>
                            <Select
                                label="Operator"
                                value={param.operator}
                                onChange={(e) => handleCriteriaChange(e, index, "operator")}
                            >
                                <MenuItem value="AND">AND</MenuItem>
                                <MenuItem value="OR">OR</MenuItem>
                                <MenuItem value="NOT">NOT</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    {/* Search criteria dropdown */}
                    <FormControl fullWidth sx={{ marginRight: 2 }}>
                        <InputLabel>Search Criteria</InputLabel>
                        <Select
                            label="Search Criteria"
                            value={param.idx || "q"}
                            onChange={(e) => handleCriteriaChange(e, index, "idx")}
                        >
                            <MenuItem value="q">Keyword</MenuItem>
                            <MenuItem value="intitle">Title</MenuItem>
                            <MenuItem value="inauthor">Author</MenuItem>
                            <MenuItem value="inpublisher">Publisher</MenuItem>
                            <MenuItem value="insubjects">Subject</MenuItem>
                            <MenuItem value="isbn">ISBN</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Search term input */}
                    <TextField
                        label="Search Term"
                        value={param.searchTerm}
                        onChange={(e) => handleCriteriaChange(e, index, "searchTerm")}
                        fullWidth
                        sx={{ marginRight: 2 }}
                    />

                    {/* Remove criterion (X icon) */}
                    {index > 0 && (
                        <IconButton
                            color="secondary"
                            onClick={() => handleRemoveCriterion(index)}
                            sx={{ marginLeft: 2 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                </Box>
            ))}

            {/* Add criterion button */}
            <Button variant="contained" color="primary" onClick={handleAddCriterion} sx={{ marginTop: 2 }}>
                Add Criterion
            </Button>
        </>
    );
};

export default CriteriaSection;
