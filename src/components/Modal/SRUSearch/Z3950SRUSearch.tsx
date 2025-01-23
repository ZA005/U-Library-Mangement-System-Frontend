/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

// TO BE IMPLEMENTED

import React, { useState } from 'react';
import { Modal, TextField, Box, Button, Grid, Typography } from '@mui/material';

interface Z3950SRUSearchProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => void;
}

const Z3950SRUSearch: React.FC<Z3950SRUSearchProps> = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        keyword: '',
        title: '',
        author: '',
        publisher: '',
        subject: '',
        isbn: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose(); // Close modal after submit
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Search Criteria
                </Typography>
                <Grid container spacing={2}>
                    {Object.keys(formData).map((key) => (
                        <Grid item xs={12} key={key}>
                            <TextField
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                name={key}
                                value={formData[key as keyof typeof formData]}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button onClick={onClose} sx={{ marginRight: 2 }}>Cancel</Button>
                    <Button onClick={handleSubmit}>Search</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default Z3950SRUSearch;

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    p: 3,
};
