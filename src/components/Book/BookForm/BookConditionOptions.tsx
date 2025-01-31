import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const BookConditionSelect: React.FC<{
    bookCondition: string;
    setBookCondition: React.Dispatch<React.SetStateAction<string>>
}> = ({ bookCondition, setBookCondition }) => {
    return (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="condition-label">Book Condition</InputLabel>
            <Select
                labelId="status-label"
                value={bookCondition}
                onChange={(e) => setBookCondition(e.target.value)}
                label="Book Condition"
                size="small"
            >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Like New">Like New</MenuItem>
                <MenuItem value="Fair">Fair</MenuItem>
                <MenuItem value="Poor">Poor</MenuItem>
                <MenuItem value="Damaged">Damaged</MenuItem>
                <MenuItem value="Water Damaged">Water Damaged</MenuItem>
                <MenuItem value="Repaired">Repaired</MenuItem>
                <MenuItem value="Missing Parts">Missing Parts</MenuItem>
            </Select>
        </FormControl>
    );
};

export default BookConditionSelect;


