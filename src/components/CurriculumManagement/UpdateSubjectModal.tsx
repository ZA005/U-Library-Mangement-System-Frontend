import React, { useState, useEffect } from "react";
import ModalForm from "../Modal/ModalForm";
// import { Program, getAllProgramByDepartment } from "../../services/Curriculum/ProgramService";
import { Department, getAllDepartments } from "../../services/Curriculum/DepartmentService";
import { updateSubject, Subject } from "../../services/Curriculum/SubjectService";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
interface UpdateSubjectModalProps {
  open: boolean;
  handleClose: () => void;
  onSubjectUpdate: () => void;
  subject: Subject | null;
}

const UpdateSubjectModal: React.FC<UpdateSubjectModalProps> = ({
  open,
  handleClose,
  onSubjectUpdate,
  subject,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  // const [programs, setPrograms] = useState<Program[]>([]);

  const [subjectName, setSubjectName] = useState("");
  const [programName, setProgramName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [year, setYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarStatus,
    openSnackbar,
    closeSnackbar,
  } = useSnackbar();

  // Fetch departments independently
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const fetchedDepartments = await getAllDepartments();
        setDepartments(fetchedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Update fields when modal opens or subject changes
  useEffect(() => {
    if (open && subject) {
      setSubjectName(subject.subject_name);
      setDepartmentName(subject.department_name);
      setYear(convertYearToString(subject.year) || "");

      const selectedDepartment = departments.find(
        (dept) => dept.name === subject.department_name
      );

      // if (selectedDepartment?.id) {
      //   fetchPrograms(selectedDepartment.id).then(() => {
      //     setProgramName(subject.program_name);
      //   });
      // }
    } else if (!open) {
      resetFields();
    }
  }, [open, subject, departments]);

  // Fetch programs based on department
  const fetchPrograms = async (departmentId: number) => {
    try {
      // const fetchedPrograms = await getAllProgramByDepartment(departmentId);
      // setPrograms(fetchedPrograms);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const resetFields = () => {
    setSubjectName("");
    setDepartmentName("");
    setProgramName("");
    setYear("");
    // setPrograms([]);
  };

  const convertYearToString = (year: number): string | null => {
    switch (year) {
      case 1:
        return "1st Year";
      case 2:
        return "2nd Year";
      case 3:
        return "3rd Year";
      case 4:
        return "4th Year";
      case 5:
        return "5th Year";
      default:
        return null;
    }
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
        return null;
    }
  };

  const handleDepartmentChange = (name: string) => {
    setDepartmentName(name);
    setProgramName(""); // Reset program selection
    const selectedDepartment = departments.find((dept) => dept.name === name);
    // if (selectedDepartment?.id) {
    //   fetchPrograms(selectedDepartment.id);
    // } else {
    //   setPrograms([]);
    // }
  };

  // const findProgramId = (programName: string, programs: Program[]): number | null => {
  //   const program = programs.find((program) => program.name === programName);
  //   return program ? Number(program.id) : null;
  // }

  const handleConfirm = async () => {
    if (isSubmitting || !subject) return; // Prevent submission if already submitting

    setIsSubmitting(true); // Disable the button by setting submitting state to true

    // const programId = findProgramId(programName, programs);

    const updatedSubject = {
      ...subject,
      // program_id: programId ?? 0,
      program_name: programName,
      department_name: departmentName,
      subject_name: subjectName,
      year: convertYearToInteger(year) ?? 1
    }

    try {
      await updateSubject(subject.id, updatedSubject);
      onSubjectUpdate();
      handleClose();
      resetFields();

      openSnackbar("Subject updated successfully!", "success")
    } catch (error) {
      console.error(error);

      openSnackbar("Department already exist!", "error");
    } finally {
      // Re-enable the button after a short delay (2 seconds here)
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };

  return (
    <>
      <ModalForm
        open={open}
        handleClose={handleClose}
        title="Edit Subject"
        fields={[
          {
            label: "Subject Name",
            type: "text",
            value: subjectName,
            onChange: setSubjectName,
            required: true,
            disabled: false,
          },
          {
            label: "Associated Department",
            type: "select",
            value: departmentName,
            onChange: handleDepartmentChange,
            options: departments.map((dept) => dept.name),
            required: true,
            disabled: false,
          },
          {
            label: "Associated Course",
            type: "select",
            value: programName,
            onChange: setProgramName,
            // options: programs.map((program) => program.name),
            required: true,
            disabled: false,
          },
          {
            label: "Year",
            type: "select",
            value: year,
            onChange: setYear,
            options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
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

export default UpdateSubjectModal;
