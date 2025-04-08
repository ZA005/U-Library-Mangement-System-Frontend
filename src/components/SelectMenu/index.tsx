import React from "react";
import { FormControl, Select, MenuItem, InputLabel, SelectChangeEvent, SxProps, Theme } from "@mui/material";

interface SelectMenuProps {
    label: string;
    value: string | number;
    onChange: (event: SelectChangeEvent<string | number>) => void;
    options?: { id: string | number; name: string }[];
    disabled?: boolean;
    menuSize?: "small" | "medium";
    sx?: SxProps<Theme>;
}

const SelectMenu: React.FC<SelectMenuProps> = ({
    label,
    value,
    onChange,
    options = [],
    disabled = false,
    menuSize,
    sx,
}) => {
    const defaultSx = {
        width: { xs: "100%", md: "250px", lg: "100%" },
    };

    return (
        <FormControl
            variant="outlined"
            size={menuSize || "small"}
            disabled={disabled}
            sx={sx || defaultSx} // Use provided sx if available, otherwise use defaultSx
        >
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                value={value}
                onChange={onChange}
                label={label}
            >
                {options.length === 0 ? (
                    <MenuItem disabled>No options available</MenuItem>
                ) : (
                    options.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.name}
                        </MenuItem>
                    ))
                )}
            </Select>
        </FormControl>
    );
};

export default SelectMenu;