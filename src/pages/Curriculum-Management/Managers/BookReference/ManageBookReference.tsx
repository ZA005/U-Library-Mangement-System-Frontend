import React, { useState, useEffect } from "react";
import {
    Box, Button, Container, IconButton, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../../components/Header/Header";
import Line from "../../../../components/Line/Line";
import Copyright from "../../../../components/Footer/Copyright";
import Sidebar from "../../../../components/Sidebar";
import { Course } from "../../../../services/Curriculum/CourseService";
import { useDepartments } from "../../../../hooks/useDepartments";
import { useProgramsByDepartment } from "../../../../hooks/usePrograms";
import { useFetchAllCurriculumByProgram } from "../../../../hooks/useCourse";
import useConverter from "./useConvert";
import ViewBookReference from "../../../../components/CurriculumManagement/ViewBookReferences/ViewBookReference";
import styles from "../styles.module.css";

const ManageBookReference: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const { yearLevelConverter, semesterConverter } = useConverter();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isBookReferenceOpen, setBookReferenceOpen] = useState(false);

    const [departmentId, setDepartmentId] = useState<string>("");
    const [departmentName, setDepartmentName] = useState<string>("");
    const [programId, setProgramId] = useState<number | undefined>(undefined);
    const [programDescription, setProgramDescription] = useState<string>("");
    const [selectedRevision, setSelectedRevision] = useState<number | undefined>(undefined);

    const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments(true);
    const { programs, loading: programsLoading, error: programsError } = useProgramsByDepartment(departmentId);
    const { courses, loading: courseLoading, error: courseError } = useFetchAllCurriculumByProgram(programId);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleDepartmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as string;
        setDepartmentId(value);
        setDepartmentName(value);
        setProgramId(undefined);
        setSearchTerm("");
        setSelectedRevision(undefined);
    };

    const handleProgramChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as number;
        setProgramId(value);
        setSearchTerm("");
        setSelectedRevision(undefined);

        const selectedProgram = programs.find((prog) => prog.prog_id === value);
        if (selectedProgram) {
            setProgramDescription(selectedProgram.description);
        }
    };

    const handleRevisionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedRevision(event.target.value as number | undefined);
    };

    const processedCourses = courses?.map((course) => ({
        ...course,
        year_level: yearLevelConverter(course.year_level),
        sem: semesterConverter(course.sem),
    })) || [];

    const filteredCourses = processedCourses.filter((course) => {
        return (
            course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedRevision ? course.revision_no === selectedRevision : true)
        );
    });

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const uniqueRevisions = Array.from(new Set(courses?.map((course) => course.revision_no) || [])).filter(Boolean);

    const handleOpenBookReference = (course: Course) => {
        setSelectedCourse(course);
        setBookReferenceOpen(true);
    };

    const handleCloseBookReference = () => {
        setSelectedCourse(null);
        setBookReferenceOpen(false);
    };

    return (
        <Box className={styles.rootContainer}>
            <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />
            <Container maxWidth="lg" className={styles.container}>
                <Header
                    buttons={
                        <IconButton onClick={toggleSidebar}>
                            <MenuIcon className={styles.menuIcon} />
                        </IconButton>
                    }
                />
                <Typography variant="h4" gutterBottom className={styles.title}>
                    Manage Book Reference
                </Typography>

                <Line />

                <Box className={styles.actionBar}>
                    <Box>
                        <Select
                            value={departmentId}
                            onChange={handleDepartmentChange}
                            displayEmpty
                            size="small"
                            sx={{ width: 300, marginRight: 2 }}
                        >
                            <MenuItem value="" disabled>
                                Select Department
                            </MenuItem>
                            {departments.map((department) => (
                                <MenuItem key={department.id} value={department.id}>
                                    {department.name}
                                </MenuItem>
                            ))}
                        </Select>

                        <Select
                            value={programId || ''}
                            onChange={handleProgramChange}
                            displayEmpty
                            size="small"
                            sx={{ width: 300, marginRight: 2 }}
                            disabled={!departmentId}
                        >
                            <MenuItem value="" disabled>
                                Select Program
                            </MenuItem>
                            {programs.map((program) => (
                                <MenuItem key={program.prog_id} value={program.prog_id}>
                                    {program.description}
                                </MenuItem>
                            ))}
                        </Select>

                        <Select
                            value={selectedRevision || ''}
                            onChange={handleRevisionChange}
                            displayEmpty
                            size="small"
                            sx={{ width: 200, marginRight: 2 }}
                            disabled={!programId}
                        >
                            <MenuItem value="">All Revisions</MenuItem>
                            {uniqueRevisions.map((revision) => (
                                <MenuItem key={revision} value={revision}>
                                    Revision {revision}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box className={styles.searchBox}>
                        <TextField
                            placeholder="Search by Description..."
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{ startAdornment: <SearchIcon className={styles.searchIcon} /> }}
                            disabled={!programId}
                        />
                    </Box>
                </Box>

                {courseLoading ? (
                    <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
                        Loading courses...
                    </Typography>
                ) : courseError ? (
                    <Typography variant="body1" sx={{ textAlign: "center", color: "gray", marginTop: 2 }}>
                        Please select a department and program to view its courses.
                    </Typography>
                ) : (
                    <TableContainer
                        component={Paper}
                        className={styles.tableContainer}
                        sx={{ maxHeight: "60vh", overflowY: "auto" }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>YEAR LEVEL</strong></TableCell>
                                    <TableCell><strong>SEMESTER</strong></TableCell>
                                    <TableCell><strong>CODE</strong></TableCell>
                                    <TableCell><strong>DESCRIPTION</strong></TableCell>
                                    <TableCell><strong>ACTION</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((course) => (
                                        <TableRow key={course.course_id}>
                                            <TableCell width="12%">{course.year_level}</TableCell>
                                            <TableCell width="12%">{course.sem}</TableCell>
                                            <TableCell width="10%">{course.course_code}</TableCell>
                                            <TableCell width="50%">{course.course_name}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="text"
                                                    sx={{ color: "#EA4040", textTransform: "none" }}
                                                    onClick={() => handleOpenBookReference(course)}
                                                >
                                                    View References
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="body1" sx={{ color: "gray" }}>
                                                No courses under {programDescription}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {loading && (
                    <Box sx={{ textAlign: "center", marginTop: 2 }}>
                        <CircularProgress />
                    </Box>
                )}

                {selectedCourse && isBookReferenceOpen && (
                    <ViewBookReference course={selectedCourse} onClose={handleCloseBookReference} /> // Changed to ViewBookReference
                )}
            </Container>
            <Copyright />
        </Box>
    );
}

export default ManageBookReference;