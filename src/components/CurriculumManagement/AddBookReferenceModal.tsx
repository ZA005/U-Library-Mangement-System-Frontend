import React, { useState, useEffect } from "react";
import ModalForm from "../Modal/ModalForm";
import { Department, getAllDepartments } from "../../services/Curriculum/DepartmentService";
import { Program, getAllProgramByDepartment } from "../../services/Curriculum/ProgramService";
import { getAllSubjectsByProgram } from "../../services/Curriculum/SubjectService";
import { addBookRef } from "../../services/Curriculum/BookReferenceService";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";

interface Subject {
    id: number;
    subject_name: string;
}

interface AddBookReferenceModalProps {
    open: boolean;
    handleClose: () => void;
    bookName: string;
    urlPath: string;
}

const AddBookReferenceModal: React.FC<AddBookReferenceModalProps> = ({
    open,
    handleClose,
    bookName,
    urlPath
}) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [departmentName, setDepartmentName] = useState("");
    const [programName, setProgramName] = useState("");
    const [subjectName, setSubjectName] = useState<string>("");
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();

    const resetFields = () => {
        setDepartmentName("");
        setProgramName("");
        setSubjectName("");
        setStatus("");
        setDepartments([]);
        setPrograms([]);
        setSubjects([]);
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
    }, [open]);

    const fetchPrograms = async (departmentName: string) => {
        try {
            const selectedDepartment = departments.find(
                (dept) => dept.name === departmentName
            );

            if (selectedDepartment?.id) {
                const fetchedPrograms = await getAllProgramByDepartment(selectedDepartment.id);
                setPrograms(fetchedPrograms);
            } else {
                setPrograms([]);
            }
        } catch (error) {
            console.error("Error fetching programs:", error);
        }
    };

    const fetchSubjects = async (programName: string) => {
        try {
            const selectedProgram = programs.find((program) => program.name === programName);

            if (selectedProgram?.id) {
                const fetchedSubjects = await getAllSubjectsByProgram(selectedProgram.id);
                setSubjects(fetchedSubjects); // Store the full subject objects with id and name
            } else {
                setSubjects([]);
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const handleDepartmentChange = (name: string) => {
        setDepartmentName(name);
        setProgramName("");
        setSubjectName(""); // Reset subject
        if (name) {
            fetchPrograms(name);
        } else {
            setPrograms([]);
            setSubjects([]);
        }
    };

    const handleProgramChange = (name: string) => {
        setProgramName(name);
        setSubjectName(""); // Reset subject
        if (name) {
            fetchSubjects(name);
        } else {
            setSubjects([]);
        }
    };

    const handleConfirm = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        // Find the subject ID using the subject name
        const selectedSubject = subjects.find(
            (subject) => subject.subject_name === subjectName
        );

        if (!selectedSubject) {
            openSnackbar("Please select a valid subject.", "error");
            setIsSubmitting(false);
            return;
        }

        const newBookRef = {
            book_name: bookName,
            subject_id: selectedSubject.id, // Store subject ID
            status: status === "Active" ? 1 : 0,
            urlPath: urlPath
        };

        try {
            await addBookRef(newBookRef);
            handleClose();
            resetFields();
            openSnackbar("Book reference added successfully!", "success");
        } catch (error) {
            console.error("Error adding book reference:", error);
            openSnackbar("Failed to add book reference. Please try again.", "error");
        } finally {
            setTimeout(() => setIsSubmitting(false), 2000);
        }
    };

    return (
        <>
            <ModalForm
                open={open}
                handleClose={handleClose}
                title="Add Book Reference"
                fields={[
                    {
                        label: "Book Name",
                        type: "text",
                        value: bookName,
                        onChange: () => { },
                        required: true,
                        readonly: true,
                    },
                    {
                        label: "Department",
                        type: "select",
                        value: departmentName,
                        onChange: handleDepartmentChange,
                        options: departments.map((dept) => dept.name),
                        required: true,
                    },
                    {
                        label: "Program",
                        type: "select",
                        value: programName,
                        onChange: handleProgramChange,
                        options: programs.map((program) => program.name),
                        required: true,
                    },
                    {
                        label: "Subject",
                        type: "select",
                        value: subjectName,
                        onChange: setSubjectName,
                        options: subjects.map((subject) => subject.subject_name),
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

export default AddBookReferenceModal;
