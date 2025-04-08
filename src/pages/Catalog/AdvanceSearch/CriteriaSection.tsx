import React from "react";
import { Box, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SelectMenu from "../../../components/SelectMenu";

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
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ value: unknown }>,
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

    const operatorOptions = [
        { id: "AND", name: "AND" },
        { id: "OR", name: "OR" },
        { id: "NOT", name: "NOT" },
    ];

    const criteriaOptions = [
        { id: "q", name: "Keyword" },
        { id: "intitle", name: "Title" },
        { id: "inauthor", name: "Author" },
        { id: "inpublisher", name: "Publisher" },
        { id: "insubjects", name: "Subject" },
        { id: "isbn", name: "ISBN" },
    ];

    return (
        <Box
            padding={2}
            borderRadius={2}
            border="1px solid #ddd"
            sx={{ backgroundColor: "#f9f9f9" }}
        >
            {criteria.map((param, index) => (
                <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    marginBottom={index === criteria.length - 1 ? 0 : 1.5} // Reduced margin between rows
                >
                    {/* Logical operator dropdown */}
                    {index > 0 && (
                        <SelectMenu
                            label="Operator"
                            value={param.operator}
                            onChange={(e) => handleCriteriaChange(e as React.ChangeEvent<{ value: unknown }>, index, "operator")}
                            options={operatorOptions}
                            menuSize="medium"
                            sx={{
                                minWidth: 100, // Smaller width for Operator
                                marginRight: 1.5, // Tighter spacing
                            }}
                        />
                    )}

                    {/* Search criteria dropdown */}
                    <SelectMenu
                        label="Search Criteria"
                        value={param.idx || "q"}
                        onChange={(e) => handleCriteriaChange(e as React.ChangeEvent<{ value: unknown }>, index, "idx")}
                        options={criteriaOptions}
                        menuSize="medium"
                        sx={{
                            width: "100%", // Full width but constrained by parent
                            maxWidth: 300, // Limit max width for better control
                            marginRight: 2, // Slightly larger spacing
                        }}
                    />

                    {/* Search term input */}
                    <TextField
                        label="Search Term"
                        value={param.searchTerm}
                        onChange={(e) => handleCriteriaChange(e, index, "searchTerm")}
                        fullWidth
                        sx={{ marginRight: 1.5 }} // Reduced margin
                    />

                    {/* Remove criterion (X icon) */}
                    {index > 0 && (
                        <IconButton
                            color="error"
                            onClick={() => handleRemoveCriterion(index)}
                            sx={{ marginLeft: 1 }} // Tighter margin on the left
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                </Box>
            ))}

            {/* Add criterion button */}
            <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 1.5 }}> {/* Reduced top margin */}
                <Button variant="contained" color="primary" onClick={handleAddCriterion}>
                    Add Criterion
                </Button>
            </Box>
        </Box>
    );
};

export default CriteriaSection;