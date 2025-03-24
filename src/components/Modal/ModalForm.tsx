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
    onOptionalClick?: () => void;
    optionalText?: string;
    disabled?: boolean;
}

const ModalForm: React.FC<ModalFormProps> = ({
    open,
    handleClose,
    title,
    fields,
    onConfirm,
    confirmText,
    onOptionalClick,
    optionalText,
    disabled
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
                position="absolute"
                top="50%"
                left="50%"
                width="400px"
                padding="16px"
                boxShadow="24px 24px 24px rgba(0, 0, 0, 0.2)"
                borderRadius="8px"
                sx={{
                    maxHeight: "90vh",
                    overflowY: "auto",
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    "&::-webkit-scrollbar": { display: "none" },
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white"
                }}
            >
                <Stack spacing={1}>
                    <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" marginBottom="16px">
                        {/* <span className={styles.modalHeaderLine} /> */}
                        {title}
                    </Typography>

                    {fields.map((field, index) => (
                        <TextField
                            key={index}
                            label={field.label}
                            variant="outlined"
                            value={field.value}
                            onChange={(e) => handleFieldChange(e.target.value, index)}

                            error={!!fieldErrors[index]}
                            helperText={fieldErrors[index]}
                            select={field.type === "select"}
                            type={field.type === "number" ? "number" : "text"}
                            disabled={field.disabled}
                            InputProps={{
                                readOnly: field.readonly,
                            }}
                            sx={{
                                marginBottom: "16px"
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
                        disabled={!isFormValid || disabled}
                    >
                        {confirmText}
                    </Button>
                    {optionalText && onOptionalClick && (
                        <Button
                            variant="outlined"
                            sx={{
                                color: "#EA4040",
                                borderColor: "#EA4040",
                                textTransform: "none",
                                ":hover": { backgroundColor: "#f2f2f2", borderColor: "#d13333", color: "#d13333" },
                            }}
                            onClick={onOptionalClick}
                            disabled={!isFormValid || disabled}
                        >
                            {optionalText}
                        </Button>
                    )}
                    <Button
                        variant="text"
                        sx={{
                            color: "#EA4040",
                            textTransform: "none",
                            ":hover": { backgroundColor: "#f2f2f2", color: "#d13333" },
                        }}
                        onClick={handleClose}
                        disabled={!isFormValid || disabled}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ModalForm;
