import React, { useState, useEffect } from "react";
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

type FieldType = "text" | "select";

interface Field {
  label: string;
  type: FieldType;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  required?: boolean;
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
  // Validation state to track field errors
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Validate fields when the modal opens or fields change
  useEffect(() => {
    const initialErrors: { [key: string]: string } = {};

    fields.forEach((field, index) => {
      if (field.required && !field.value) {
        initialErrors[index] = `${field.label} is required`;
      }
    });

    setFieldErrors(initialErrors);
  }, [fields, open]);

  // Handle field changes and validation
  const handleFieldChange = (value: string, index: number) => {
    const newFields = [...fields];
    newFields[index].onChange(value);

    // Update validation errors
    const newErrors = { ...fieldErrors };
    if (newFields[index].required && !value) {
      newErrors[index] = `${newFields[index].label} is required`;
    } else {
      delete newErrors[index];
    }

    setFieldErrors(newErrors);
  };

  // Check if any field has an error or is empty
  const isFormValid = Object.keys(fieldErrors).length === 0;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.modalBox}>
        <Stack spacing={2}>
          <Typography
            variant="h6"
            component="h2"
            fontWeight="bold"
            className={styles.modalHeader}
          >
            <span className={styles.modalHeaderLine} />
            {title}
          </Typography>
          {fields.map((field, index) => {
            if (field.type === "text") {
              return (
                <TextField
                  key={index}
                  label={field.label}
                  variant="outlined"
                  value={field.value}
                  onChange={(e) => handleFieldChange(e.target.value, index)}
                  className={styles.textField}
                  error={!!fieldErrors[index]}
                  helperText={fieldErrors[index]}
                />
              );
            } else if (field.type === "select" && field.options) {
              return (
                <TextField
                  key={index}
                  select
                  label={field.label}
                  variant="outlined"
                  value={field.value}
                  onChange={(e) => handleFieldChange(e.target.value, index)}
                  className={styles.textField}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflow: "auto",
                        },
                      },
                    },
                  }}
                  error={!!fieldErrors[index]}
                  helperText={fieldErrors[index]}
                >
                  {field.options.map((option, idx) => (
                    <MenuItem key={idx} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }
            return null;
          })}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#EA4040",
              color: "#fff",
              textTransform: "none",
              ":hover": { backgroundColor: "#d13333" },
            }}
            onClick={onConfirm}
            disabled={!isFormValid} // Disable the button if form is invalid
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
