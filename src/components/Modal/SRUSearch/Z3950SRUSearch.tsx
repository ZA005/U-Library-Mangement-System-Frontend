/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import styles from "../styles.module.css";
import { newSearchGoogleBooks } from '../../../services/Cataloging/GoogleBooksApi';
import { Book } from '../../../model/Book';

type FieldType = "text" | "select";

interface Field {
    label: string;
    type: FieldType;
    value: string;
    onChange: (value: string) => void;
    options?: string[];
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
}

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

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialFormData) {
            setFormData(initialFormData);
        }
    }, [initialFormData]);

    useEffect(() => {
        const initialErrors: { [key: string]: string } = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (!value) {
                initialErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
            }
        });
        setFieldErrors(initialErrors);
    }, [formData]);

    const handleFieldChange = (value: string, key: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [key]: value
        }));

        const newErrors = { ...fieldErrors };
        if (!value) {
            newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        } else {
            delete newErrors[key];
        }
        setFieldErrors(newErrors);
    };


    const handleSubmit = async () => {
        try {
            const books = await newSearchGoogleBooks(formData);
            console.log("Books Found:", books);
            onSubmit(books, "Z39.50/SRU", formData);
        } catch (error) {
            console.log("Error searching Google Books:", error);
        }
        onClose();

    };

    const fields: Field[] = [
        { label: "Keyword", type: "text", value: formData.keyword, onChange: value => handleFieldChange(value, "keyword"), required: true },
        { label: "Title", type: "text", value: formData.title, onChange: value => handleFieldChange(value, "title") },
        { label: "Author", type: "text", value: formData.author, onChange: value => handleFieldChange(value, "author") },
        { label: "Publisher", type: "text", value: formData.publisher, onChange: value => handleFieldChange(value, "publisher") },
        { label: "ISBN", type: "text", value: formData.isbn, onChange: value => handleFieldChange(value, "isbn") },
        { label: "LCCN", type: "text", value: formData.lccn, onChange: value => handleFieldChange(value, "lccn") },
    ];

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={styles.modalBox}>
                <Stack spacing={2}>
                    <Typography
                        variant="h6"
                        component="h2"
                        fontWeight="bold"
                        className={styles.modalHeader}
                    >
                        <span className={styles.modalHeaderLine} />
                        Search Criteria
                    </Typography>
                    {fields.map((field, index) => (
                        <TextField
                            key={index}
                            label={field.label}
                            variant="outlined"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className={styles.textField}
                        />
                    ))}
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#EA4040",
                            color: "#fff",
                            textTransform: "none",
                            ":hover": { backgroundColor: "#d13333" },
                        }}
                        onClick={handleSubmit}
                    >
                        Search
                    </Button>
                    <Button
                        variant="text"
                        sx={{
                            color: "#EA4040",
                            textTransform: "none",
                            ":hover": { backgroundColor: "#f2f2f2", color: "#d13333" },
                        }}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default Z3950SRUSearch;