import React, { useState, useEffect } from "react";
import ModalForm from "../Modal/ModalForm";
import { addProgram } from "../../services/Curriculum/ProgramService";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useDepartments } from "../../hooks/useDepartments";

interface AddNewCourseModalProps {
  open: boolean;
  handleClose: () => void;
  onProgramAdd: () => void;
}

const AddNewCourseModal: React.FC<AddNewCourseModalProps> = ({
  open,
  handleClose,
  onProgramAdd,
}) => {

  const [courseName, setCourseName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [status, setStatus] = useState("");
  const { departments, loading, error } = useDepartments(open);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarStatus,
    openSnackbar,
    closeSnackbar,
  } = useSnackbar();

  useEffect(() => {
    if (error) {
      openSnackbar(error, "error");
    }
    if (!open) {
      resetFields()
    }
  }, [error, openSnackbar]);

  const handleConfirm = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const departmentId = departments.find((dept) => dept.name === departmentName)?.id;

    if (!departmentId) {
      openSnackbar("Department not found!", "error");
      setIsSubmitting(false);
      return;
    }

    const newProgram = {
      name: courseName,
      department_id: departmentId,
      department_name: departmentName,
      status: status === "Active" ? 1 : 0,
    };

    try {
      await addProgram(newProgram);
      onProgramAdd();
      handleClose();
      resetFields();

      openSnackbar("Program added successfully!", "success")
    } catch (error) {
      console.error("Error adding program:", error);
      openSnackbar("Program already existed!", "error")
    } finally {
      // Re-enable the button after a short delay (2 seconds here)
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };


  const resetFields = () => {
    setCourseName("");
    setDepartmentName("");
    setStatus("");
  }
  return (
    <>
      <ModalForm
        open={open}
        handleClose={handleClose}
        title="Add New Course"
        fields={[
          {
            label: "Course Name",
            type: "text",
            value: courseName,
            onChange: setCourseName,
            required: true,
          },
          {
            label: "Associated Department",
            type: "select",
            value: departmentName,
            onChange: setDepartmentName,
            options: loading ? ["Loading..."] : departments.map((dept) => dept.name),
            required: true,
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
        confirmText="Confirm"
      />
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
        <Alert onClose={closeSnackbar} severity={snackbarStatus}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>

  );
};

export default AddNewCourseModal;