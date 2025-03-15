import React from "react";
import { FormControl, Select, MenuItem, InputLabel, SelectChangeEvent } from "@mui/material";

interface SelectMenuProps {
    label: string;
    value: string;
    onChange: (event: SelectChangeEvent<string>) => void;
    options: { id: string; name: string }[];
}

const SelectMenu: React.FC<SelectMenuProps> = ({ label, value, onChange, options }) => {
    return (
        <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                value={value}
                onChange={onChange}
                label={label}
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectMenu;
