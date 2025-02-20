import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import styles from "./styles.module.css";



interface Field {
  label: string;
  type: "text" | "button";
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  options?: string[];
  onClick?: () => void;
}

interface CirculationModalFormProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  fields: Field[];
  onConfirm: () => void;
  confirmText: string;
  errorMessage?: string | null;
  onClick?: () => void;
}

const CirculationModalForm: React.FC<CirculationModalFormProps> = ({
  open,
  handleClose,
  title,
  fields,
  onConfirm,
  confirmText,
  errorMessage,
}) => {
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
          {errorMessage && (
            <Typography
              variant="body2"
              color="error"
              className={styles.errorMessage}
            >
              {errorMessage}
            </Typography>
          )}
          {fields.map((field, index) => {
            if (field.type === "text") {
              return (
                <TextField
                  key={index}
                  label={field.label}
                  variant="outlined"
                  value={field.value}
                  onChange={field.readOnly ? undefined : (e) => field.onChange?.(e.target.value)}
                  InputProps={{ readOnly: field.readOnly }}
                  className={styles.textField}
                />
              );
            } else if (field.type === "button") {
              return (
                <Button
                  key={index}
                  variant="contained"
                  onClick={field.onClick}
                  sx={{ mt: 1 }}
                >
                  {field.label}
                </Button>
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


export default CirculationModalForm;
