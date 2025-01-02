import React, { useState, useEffect } from "react";
import ModalForm from "../Modal/ModalForm";
import { Program, getAllProgramByDepartment } from "../../services/Curriculum/ProgramService";
import { Department, getAllDepartments } from "../../services/Curriculum/DepartmentService";
import { addSubject } from "../../services/Curriculum/SubjectService";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";

interface AddNewSubjectModalProps {
  open: boolean;
  handleClose: () => void;
  onSubjectAdd: () => void;
}

const AddNewSubjectModal: React.FC<AddNewSubjectModalProps> = ({
  open,
  handleClose,
  onSubjectAdd,
}) => {
  const [subjectName, setSubjectName] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [departmentName, setDepartmentName] = useState("");
  const [programName, setProgramName] = useState("");
  const [year, setYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarStatus,
    openSnackbar,
    closeSnackbar,
  } = useSnackbar();


  const resetFields = () => {
    setSubjectName("");
    setDepartmentName("");
    setProgramName("");
    setYear("");
    setDepartments([]);
    setPrograms([]);
  };


  useEffect(() => {
    if (open) {
      const fetchDepartments = async () => {
        try {
          const fetchedDepartments = await getAllDepartments();
          setDepartments(fetchedDepartments);
        } catch (error) {
          console.error("Error fetching departments:", error);
        }
      };

      fetchDepartments();
    } else {
      resetFields();
    }

  }, [open],);

  // Fetch programs based on selected department
  const fetchPrograms = async (departmentName: string) => {
    try {
      const selectedDepartment = departments.find(
        (dept) => dept.name === departmentName
      );

      if (selectedDepartment?.id) {
        const fetchedPrograms = await getAllProgramByDepartment(selectedDepartment.id);
        setPrograms(fetchedPrograms);
      } else {
        setPrograms([]); // Reset programs if no valid department is selected
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const handleDepartmentChange = (name: string) => {
    setDepartmentName(name);
    setProgramName(""); // Reset program selection
    if (name) {
      fetchPrograms(name);
    } else {
      setPrograms([]); // Reset programs if department is cleared
    }
  };

  const findProgramId = (programName: string, programs: Program[]): number | null => {
    const program = programs.find((program) => program.name === programName);
    return program ? Number(program.id) : null;
  };

  const convertYearToInteger = (year: string): number | null => {
    switch (year) {
      case "1st Year":
        return 1;
      case "2nd Year":
        return 2;
      case "3rd Year":
        return 3;
      case "4th Year":
        return 4;
      case "5th Year":
        return 5;
      default:
        return null; // Return null if the year doesn't match any known value
    }
  };

  const handleConfirm = async () => {
    if (isSubmitting) return; // Ensure program exists before updating

    setIsSubmitting(true);

    const programId = findProgramId(programName, programs);
    const yearInt = convertYearToInteger(year);
    const newSubject = {
      program_id: programId,
      program_name: programName,
      subject_name: subjectName,
      year: yearInt
    };

    try {
      console.log('Subject DATA:', newSubject);
      await addSubject(newSubject);
      onSubjectAdd();
      handleClose();

      setSubjectName("");
      setDepartmentName("");
      setProgramName("");
      setYear("");

      openSnackbar("Subject updated successfully!", "success")
    } catch (error) {
      console.error("Error adding program:", error);
      openSnackbar("Subject updated successfully!", "success")
    } finally {
      // Re-enable the button after a short delay (2 seconds here)
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  }

  return (
    <>
      <ModalForm
        open={open}
        handleClose={handleClose}
        title="Add New Subject"
        fields={[
          {
            label: "Subject Name",
            type: "text",
            value: subjectName,
            onChange: setSubjectName,
            required: true
          },
          {
            label: "Associated Department",
            type: "select",
            value: departmentName,
            onChange: handleDepartmentChange,
            options: departments.map((dept) => dept.name),
            required: true
          },
          {
            label: "Associated Course",
            type: "select",
            value: programName,
            onChange: setProgramName,
            options: programs.map((program) => program.name),
            required: true
          },
          {
            label: "Year",
            type: "select",
            value: year,
            onChange: setYear,
            options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
            required: true
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

export default AddNewSubjectModal;
