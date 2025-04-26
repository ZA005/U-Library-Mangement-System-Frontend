import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box, TextField, InputAdornment } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, DynamicTableCell, Dropdown } from "../../../components";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";
import { useFetchAllDepartments } from "../Uploader/Department/useFetchAllDepartments";
import { useFetchAllProgramsByDepartment } from "../Uploader/Program/useFetchAllProgramsByDepartment";
import { useFetchRevisionsByProgram } from "../Uploader/Curriculum/useFetchRevisionsByProgram";
import { useFetchAllCourseByRevision } from "../Uploader/Course/useFetchAllCourseByRevision";
import ViewBookReference from "./Dialog/View/ViewBookReference";
import { useDialog } from "../../../hooks/useDialog";
import { Program, Course } from "../../../types";
import { Search, Menu } from "lucide-react";

const BookReferencing: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { data: departments } = useFetchAllDepartments();
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [selectedRevision, setSelectedRevision] = useState<number | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Book Referencing - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)}>
                <Menu color="#d32f2f" />
            </IconButton>
        );
        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    /////////////////////////////////////////////////////////////////////////////////////

    const { data: programs } = useFetchAllProgramsByDepartment(selectedDepartment);
    const { data: revisions = [], isLoading: isFetchingRevisions } = useFetchRevisionsByProgram(selectedProgram?.program_id ?? 0);
    const { isLoading: isFetchingCourse, data: courses = [], error, refetch } = useFetchAllCourseByRevision(selectedRevision ?? 0);
    const showSnackbar = useSnackbarContext();
    const { isOpen, openDialog, closeDialog } = useDialog();
    const [searchQuery, setSearchQuery] = useState("");

    /////////////////////////////////////////////////////////////////////////////////////

    const handleViewReferences = (course: Course) => {
        setSelectedCourse(course);
        openDialog();
    };

    const filteredCourses = courses.filter(course =>
        course?.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course?.course_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /////////////////////////////////////////////////////////////////////////////////////

    const columns = [
        { key: "course_code", label: "CODE" },
        { key: "course_name", label: "NAME" },
        {
            key: "action",
            label: "",
            render: (row: Course) => (
                <DynamicTableCell
                    type="button"
                    buttonText="View Book Reference"
                    onAction={() => { handleViewReferences(row) }}
                />
            ),
        }
    ]

    return (
        <>
            <PageTitle title="Manage Book References" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr 1fr" }}
                    alignItems="center"
                    gap={1}
                >
                    <Dropdown
                        label="Select Department"
                        value={selectedDepartment ?? ""}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        options={departments?.map((dept) => ({ id: dept.dept_id, name: dept.dept_name }))}
                    />


                    <Dropdown
                        label="Select Program"
                        value={selectedProgram?.program_id ?? ""}
                        onChange={(e) => {
                            const program = programs?.find((prog) => prog.program_id === Number(e.target.value));
                            setSelectedProgram(program || null);
                            setSelectedRevision(null);
                        }}
                        options={programs?.map((prog) => ({ id: prog.program_id, name: prog.description })) || []}
                        disabled={!selectedDepartment}
                    />

                    <Dropdown
                        label="Select Revision"
                        value={selectedRevision ?? ""}
                        onChange={(e) => setSelectedRevision(Number(e.target.value))}
                        options={revisions.map((rev) => ({ id: rev, name: `Revision ${rev}` })) || []}
                        disabled={!selectedProgram || revisions.length === 0}
                    />

                    <TextField
                        size="small"
                        label="Search Courses"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={15} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box mt={2}>
                    <DynamicTable
                        columns={columns}
                        data={filteredCourses}
                        loading={isFetchingCourse}
                        error={error}
                        customMsg="Please select Department, Program, and Revision to view Courses"
                        hasSelection={!!selectedDepartment && !!selectedProgram && !!selectedRevision}
                        customSize="200px"
                    />
                </Box>

            </Container>
            {isOpen && selectedCourse && (
                <ViewBookReference course={selectedCourse} onClose={closeDialog} />
            )}
        </>
    )
}

export default BookReferencing