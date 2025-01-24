/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

// TO BE IMPLEMENTED

import React, { useEffect, useState } from 'react';
import { Modal, TextField, Box, Button, Grid, Typography } from '@mui/material';
import { newSearchGoogleBooks } from '../../../services/Cataloging/GoogleBooksApi';
import { Book } from '../../../model/Book';

interface Z3950SRUSearchProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (books: Book[], source: string, query: any) => void;
    initialFormData?: any;
}

const Z3950SRUSearch: React.FC<Z3950SRUSearchProps> = ({ open, onClose, onSubmit, initialFormData }) => {
    const [formData, setFormData] = useState(initialFormData || {
        keyword: '',
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        lccn: '',
    });

    useEffect(() => {
        if (initialFormData) {
            setFormData(initialFormData);
        }
    }, [initialFormData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleSubmit = async (formData: any) => {
        try {
            const books = await newSearchGoogleBooks(formData);
            console.log("Books Found:", books);
            onSubmit(books, "Z39.50/SRU", formData);
        } catch (error) {
            console.log("Error searching Z39.50/SRU:", error);
            // Optionally, handle errors by showing them in the modal or passing an error message
        }
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
                    <Button onClick={() => handleSubmit(formData)}>Search</Button>

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
