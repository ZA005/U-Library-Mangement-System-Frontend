import React, { useState } from "react";
import { FormControl, Select, MenuItem, Button } from "@mui/material";

interface ActionCellProps {
    type: "menu" | "button";
    buttonText?: string;
    options?: { value: string; label: string }[];
    onAction: (value: string) => void;
}

const ActionCell: React.FC<ActionCellProps> = ({ type, buttonText, options, onAction }) => {
    const [selectedValue, setSelectedValue] = useState<string>("");

    const handleSelectChange = (value: string) => {
        onAction(value);
        setSelectedValue("");
    };

    if (type === "menu") {
        return (
            <FormControl fullWidth>
                <Select
                    size="small"
                    value={selectedValue}
                    onChange={(e) => handleSelectChange(e.target.value)}
                    onClose={() => setSelectedValue("")}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Action</MenuItem>
                    {options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    return (
        <Button variant="text" color="primary" onClick={() => onAction("clicked")}>
            {buttonText}
        </Button>
    );
};

export default ActionCell;
