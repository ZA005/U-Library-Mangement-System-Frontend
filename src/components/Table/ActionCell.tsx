import React from "react";
import { FormControl, Select, MenuItem, Button } from "@mui/material";

interface ActionCellProps {
    type: "menu" | "button";
    buttonText?: "";
    options?: { value: string; label: string }[];
    onAction: (value: string) => void;
}

const ActionCell: React.FC<ActionCellProps> = ({ type, buttonText, options, onAction }) => {
    if (type === "menu") {
        return (
            <FormControl fullWidth >
                <Select
                    defaultValue=""
                    onChange={(e) => onAction(e.target.value)}
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
