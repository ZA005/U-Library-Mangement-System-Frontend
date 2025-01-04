import React, { useState, useEffect } from "react";
import { Department, updateDepartment } from "../../services/Curriculum/DepartmentService";
import ModalForm from "../Modal/ModalForm";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
interface UpdateDepartmentModalProps {
  open: boolean;
  handleClose: () => void;
  onDepartmentUpdated: () => void;
  department: Department | null;
}

const UpdateDepartmentModal: React.FC<UpdateDepartmentModalProps> = ({
  open,
  handleClose,
  onDepartmentUpdated,
  department,
}) => {
  const [departmentName, setDepartmentName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarStatus,
    openSnackbar,
    closeSnackbar,
  } = useSnackbar();

  useEffect(() => {
    if (department) {
      setDepartmentName(department.name);
      setStatus(department.status === 1 ? "Active" : "Inactive");
    }

  }, [department]);

  const handleConfirm = async () => {
    if (isSubmitting || !department) return; // Ensure program exists before updating

    setIsSubmitting(true);

    const statusInt = status === "Active" ? 1 : 0;

    if (department) {
      try {
        // Prepare the updated department data
        const updatedDepartment: Department = {
          id: department.id,
          name: departmentName,
          status: statusInt,
        };

        // Make the API call to update the department
        await updateDepartment(department.id!, updatedDepartment);

        // After update, inform the parent that the department has been updated
        onDepartmentUpdated();
        openSnackbar("Department updated successfully!", "success")

        // Close the modal
        handleClose();
      } catch (error) {
        console.error("Error updating department:", error);
        openSnackbar("Department already exist!", "error");
      } finally {
        // Re-enable the button after a short delay (2 seconds here)
        setTimeout(() => setIsSubmitting(false), 2000);
      }
    }
  };

  return (
    <>
      <ModalForm
        open={open}
        handleClose={handleClose}
        title="Update Department"
        fields={[
          {
            label: "Department Name",
            type: "text" as const,
            value: departmentName,
            onChange: setDepartmentName,
            required: true,
            disabled: false,
          },
          {
            label: "Status",
            type: "select" as const,
            value: status,
            onChange: setStatus,
            options: ["Active", "Inactive"],
            required: true,
            disabled: false,
          },
        ]}
        onConfirm={handleConfirm}
        confirmText="Update"
      />
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
        <Alert onClose={closeSnackbar} severity={snackbarStatus}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>

  );
};

export default UpdateDepartmentModal;
