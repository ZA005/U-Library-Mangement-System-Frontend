import React, { useState, useEffect } from "react";
import ModalForm from "../Modal/ModalForm";
import { addDepartment, Department } from "../../services/Curriculum/DepartmentService";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";

interface AddNewDepartmentModalProps {
  open: boolean;
  handleClose: () => void;
  onDepartmentAdd: () => void;
}

const AddNewDepartmentModal: React.FC<AddNewDepartmentModalProps> = ({
  open,
  handleClose,
  onDepartmentAdd,
}) => {
  const [departmentName, setDepartmentName] = useState("");
  const [status, setStatus] = useState("Active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarStatus,
    openSnackbar,
    closeSnackbar,
  } = useSnackbar();

  useEffect(() => {
    if (!open) {
      resetFields();
    }
  })
  // Function to handle form submission and add the department
  const handleSubmit = async () => {
    if (isSubmitting) return; // Ensure program exists before updating

    setIsSubmitting(true);

    const statusInt = status === "Active" ? 1 : 0;
    const newDepartment: Department = {
      name: departmentName,
      status: statusInt,
    };

    try {
      await addDepartment(newDepartment);
      onDepartmentAdd()
      // Close the modal and clear the form fields
      handleClose();

      openSnackbar("Department added successfully!", "success")
    } catch (error) {
      console.error("Error adding department:", error);
      openSnackbar("Department already exist!", "error");
    } finally {
      // Re-enable the button after a short delay (2 seconds here)
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };

  const resetFields = () => {
    setDepartmentName("");
    setStatus("");
  }
  return (
    <>
      <ModalForm
        open={open}
        handleClose={handleClose}
        title="Add New Department"
        fields={[
          {
            label: "Department Name",
            type: "text" as const,
            value: departmentName,
            onChange: setDepartmentName,
            required: true
          },
          {
            label: "Status",
            type: "select" as const,
            value: status,
            onChange: setStatus,
            options: ["Active", "Inactive"],
            required: true
          },
        ]}
        onConfirm={handleSubmit}
        confirmText="Add Department"
      />

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
        <Alert onClose={closeSnackbar} severity={snackbarStatus}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>

  );
};

export default AddNewDepartmentModal;
