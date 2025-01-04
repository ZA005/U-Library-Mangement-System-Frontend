import React, { useState, useEffect } from "react";
import ModalForm from "../Modal/ModalForm";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { BookReference, updateBookRef } from "../../services/Curriculum/BookReferenceService";

interface UpdateBookReferenceModalProps {
  open: boolean;
  handleClose: () => void;
  onBookReferenceUpdate: () => void;
  bookReference: BookReference | null;
}

const UpdateBookReferenceModal: React.FC<UpdateBookReferenceModalProps> = ({
  open,
  handleClose,
  onBookReferenceUpdate,
  bookReference,
}) => {
  const [status, setStatus] = useState<string>("1"); // Default to "1" as a string
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarStatus,
    openSnackbar,
    closeSnackbar,
  } = useSnackbar();

  useEffect(() => {
    if (open && bookReference) {
      setStatus(bookReference.status.toString()); // Ensure the status is a string
    } else if (!open) {
      resetFields();
    }
  }, [open, bookReference]);

  const resetFields = () => {
    setStatus("1"); // Reset status to "1" as a string
  };

  const handleConfirm = async () => {
    if (isSubmitting || !bookReference) return;

    setIsSubmitting(true);

    const updatedBookReference = {
      ...bookReference,
      status: Number(status), // Convert the string status back to number before updating
    };

    try {
      await updateBookRef(bookReference.id, updatedBookReference);
      onBookReferenceUpdate();
      handleClose();
      resetFields();

      openSnackbar("Book reference updated successfully!", "success");
    } catch (error) {
      console.error("Error updating book reference:", error);
      openSnackbar("Failed to update book reference.", "error");
    } finally {
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };

  return (
    <>
      <ModalForm
        open={open}
        handleClose={handleClose}
        title="Update Book Reference"
        fields={[
          {
            label: "Book Name",
            type: "text",
            value: bookReference?.book_name || "",
            readonly: true,
            onChange: () => { }, // Provide a no-op function for onChange
          },
          {
            label: "Subject Name",
            type: "text",
            value: bookReference?.subject_name || "",
            readonly: true,
            onChange: () => { }, // Provide a no-op function for onChange
          },
          {
            label: "Status",
            type: "select",
            value: status,
            onChange: setStatus,
            options: ["Active", "Inactive"],
            required: true,
          },
        ]}
        onConfirm={handleConfirm}
        confirmText="Update"
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbarStatus}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateBookReferenceModal;
