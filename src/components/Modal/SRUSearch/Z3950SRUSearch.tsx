import React, { useState, useEffect } from 'react';
import { Books } from '../../../types';
import { SRUFormData } from '../../../types/Catalog/SRUFormData';
import { useFetchGoogleBooks } from './useGoogleSearch';
import { useLocation, useNavigate } from 'react-router-dom';
import { PROTECTED_ROUTES } from '../../../config/routeConfig';
import { Button, TextField, Stack, Typography, Box, Modal } from '@mui/material';
import styles from "../styles.module.css";

interface Z3950SRUSearchProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (books: Books[], source: string, query: any) => void;
    initialFormData: SRUFormData;
}

const Z3950SRUSearch: React.FC<Z3950SRUSearchProps> = ({ open, onClose, onSubmit, initialFormData }) => {
    const [formData, setFormData] = useState<SRUFormData>(initialFormData);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    const handleFieldChange = (value: string, key: string) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));

        const newErrors = { ...fieldErrors };
        if (!value && key === "keyword") {
            newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        } else {
            delete newErrors[key];
        }
        setFieldErrors(newErrors);
    };

    const fields = [
        { label: "Keyword", key: "keyword" },
        { label: "Title", key: "title" },
        { label: "Author", key: "author" },
        { label: "Publisher", key: "publisher" },
        { label: "ISBN", key: "isbn" },
        { label: "LCCN", key: "lccn" },
    ];

    const { error, refetch } = useFetchGoogleBooks(formData);

    const handleSubmit = async () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.keyword) {
            newErrors.keyword = "Keyword is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            return;
        }

        try {
            const result = await refetch();
            const updatedResults = result.data || [];

            if (error) {
                onSubmit([], "Z39.50/SRU", formData);
            } else if (updatedResults) {
                const currentState = location.state as { acquisitionData?: unknown } | null;
                navigate(PROTECTED_ROUTES.BROWSEALLBOOKS, {
                    state: { searchResults: updatedResults, acquisitionData: currentState?.acquisitionData },
                });
                onSubmit(updatedResults, "Z39.50/SRU", formData);
            }
        } catch (error) {
            console.error("Error submitting query:", error);
            onSubmit([], "Z39.50/SRU", formData);
        }
        onClose();
    };

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
                    {fields.map((field) => (
                        <TextField
                            key={field.key}
                            label={field.label}
                            variant="outlined"
                            value={formData[field.key as keyof SRUFormData] || ''}
                            onChange={(e) => handleFieldChange(e.target.value, field.key)}
                            className={styles.textField}
                            error={!!fieldErrors[field.key]}
                            helperText={fieldErrors[field.key]}
                            required={field.required}
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