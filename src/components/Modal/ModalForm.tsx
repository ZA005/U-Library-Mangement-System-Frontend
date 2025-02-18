import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    MenuItem,
} from "@mui/material";
import styles from "./styles.module.css";

type FieldType = "text" | "select" | "number";

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

interface ModalFormProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    fields: Field[];
    onConfirm: () => void;
    confirmText: string;
}

const ModalForm: React.FC<ModalFormProps> = ({
    open,
    handleClose,
    title,
    fields,
    onConfirm,
    confirmText,
}) => {
    const [fieldErrors, setFieldErrors] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const validateFields = () => {
            const errors: { [key: number]: string } = {};
            fields.forEach((field, index) => {
                if (field.required && !field.value.trim()) {
                    errors[index] = `${field.label} is required`;
                }
            });
            setFieldErrors(errors);
        };

        validateFields();
    }, [fields, open]);

    const handleFieldChange = useCallback(
        (value: string, index: number) => {
            fields[index].onChange(value);

            setFieldErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                if (fields[index].required && !value.trim()) {
                    newErrors[index] = `${fields[index].label} is required`;
                } else {
                    delete newErrors[index];
                }
                return newErrors;
            });
        },
        [fields]
    );

    const isFormValid = useMemo(() => Object.keys(fieldErrors).length === 0, [fieldErrors]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                className={styles.modalBox}
                sx={{
                    maxHeight: "90vh",
                    overflowY: "auto",
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    "&::-webkit-scrollbar": { display: "none" },
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h6" fontWeight="bold" className={styles.modalHeader}>
                        <span className={styles.modalHeaderLine} />
                        {title}
                    </Typography>

                    {fields.map((field, index) => (
                        <TextField
                            key={index}
                            label={field.label}
                            variant="outlined"
                            value={field.value}
                            onChange={(e) => handleFieldChange(e.target.value, index)}
                            className={styles.textField}
                            error={!!fieldErrors[index]}
                            helperText={fieldErrors[index]}
                            select={field.type === "select"}
                            type={field.type === "number" ? "number" : "text"}
                            disabled={field.disabled}
                            InputProps={{
                                readOnly: field.readonly,
                            }}
                        >
                            {field.type === "select" &&
                                field.options?.map((option, idx) => (
                                    <MenuItem key={idx} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                        </TextField>
                    ))}

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#EA4040",
                            color: "#fff",
                            textTransform: "none",
                            ":hover": { backgroundColor: "#d13333" },
                        }}
                        onClick={onConfirm}
                        disabled={!isFormValid} // Prevent submission if form is invalid
                    >
                        {confirmText}
                    </Button>

                    <Button
                        variant="text"
                        sx={{
                            color: "#EA4040",
                            textTransform: "none",
                            ":hover": { backgroundColor: "#f2f2f2", color: "#d13333" },
                        }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ModalForm;
