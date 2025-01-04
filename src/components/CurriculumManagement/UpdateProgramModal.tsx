import React, { useState, useEffect } from "react";
import ModalForm from "../Modal/ModalForm";
import { updateProgram, Program } from "../../services/Curriculum/ProgramService";
import { getAllDepartments, Department } from "../../services/Curriculum/DepartmentService";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";

interface UpdateCourseModalProps {
  open: boolean;
  handleClose: () => void;
  onProgramUpdate: () => void;
  program: Program | null;
}

const UpdateCourseModal: React.FC<UpdateCourseModalProps> = ({
  open,
  handleClose,
  onProgramUpdate,
  program,
}) => {
  const [courseName, setCourseName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [status, setStatus] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarStatus,
    openSnackbar,
    closeSnackbar,
  } = useSnackbar();

  // Fetch departments when the modal opens
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const fetchedDepartments = await getAllDepartments();
        setDepartments(fetchedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    if (open) {
      fetchDepartments();

      if (program) {
        setCourseName(program.name || ""); // Ensure fallback values to prevent errors
        setDepartmentName(program.department_name || "");
        setStatus(program.status === 1 ? "Active" : "Inactive");
      }
    }
  }, [open, program]); // Fetch departments and set form fields when modal opens or program changes

  const findDepartmentId = (departmentName: string, departments: Department[]): number | null => {
    const department = departments.find((dept) => dept.name === departmentName);
    return department ? Number(department.id) : null;
  };

  const handleConfirm = async () => {
    if (isSubmitting || !program) return; // Ensure program exists before updating

    setIsSubmitting(true);

    const departmentId = findDepartmentId(departmentName, departments);

    if (!departmentId) {
      console.error("Department not found!");
      return;
    }

    const updatedProgram = {
      ...program,
      name: courseName,
      department_id: departmentId,
      department_name: departmentName,
      status: status === "Active" ? 1 : 0,
    };

    try {
      await updateProgram(program.id, updatedProgram);
      onProgramUpdate();
      handleClose();
      resetFields();

      openSnackbar("Department updated successfully!", "success")
    } catch (error) {
      console.error("Error updating program:", error);
      openSnackbar("Department already exist!", "error");
    } finally {
      // Re-enable the button after a short delay (2 seconds here)
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };

  const resetFields = () => {
    setDepartments([]);
    setCourseName("");
    setDepartmentName("");
    setStatus("");
  }

  return (
    <>
      <ModalForm
        open={open}
        handleClose={handleClose}
        title="Update Course"
        fields={[
          {
            label: "Course Name",
            type: "text",
            value: courseName,
            onChange: setCourseName,
            required: true,
            disabled: false,
          },
          {
            label: "Associated Department",
            type: "select",
            value: departmentName,
            onChange: setDepartmentName,
            options: departments.map((dept) => dept.name),
            required: true,
            disabled: false,
          },
          {
            label: "Status",
            type: "select",
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

export default UpdateCourseModal;
