import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    IconButton,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
} from "@mui/material";
// import { Program, getAllProgramByDepartment } from "../../../services/Curriculum/ProgramService";
import { Department, getAllDepartments } from "../../../services/Curriculum/DepartmentService";
import { Subject, getAllSubjectsByProgram } from "../../../services/Curriculum/SubjectService";
import BookRefRec from "../../../components/CurriculumManagement/BookRefRecommendation/BookRefRec";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../components/Header/Header";
import Line from "../../../components/Line/Line";
import Copyright from "../../../components/Footer/Copyright";
import Sidebar from "../../../components/Sidebar";
import styles from "./styles.module.css";

const ManageBookReference: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [departments, setDepartments] = useState<Department[]>([]);
    // const [programs, setPrograms] = useState<Program[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [departmentName, setDepartmentName] = useState<string>("");
    const [programName, setProgramName] = useState<string>("");

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const toggleBookRefRec = (subject: Subject | null) => setSelectedSubject(subject);

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

    // const fetchPrograms = async (departmentName: string) => {
    //     try {
    //         const selectedDepartment = departments.find((dept) => dept.name === departmentName);

    //         if (selectedDepartment?.id) {
    //             const fetchedPrograms = await getAllProgramByDepartment(selectedDepartment.id);
    //             setPrograms(fetchedPrograms);
    //         } else {
    //             setPrograms([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching programs:", error);
    //     }
    // };

    // const fetchSubjects = async (programName: string) => {
    //     try {
    //         const selectedProgram = programs.find((program) => program.name === programName);

    //         if (selectedProgram?.id) {
    //             const fetchedSubjects = await getAllSubjectsByProgram(selectedProgram.id);
    //             setSubjects(fetchedSubjects); // Store the full subject objects with id and name
    //         } else {
    //             setSubjects([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching subjects:", error);
    //     }
    // };

    // const handleDepartmentChange = (name: string) => {
    //     setDepartmentName(name);
    //     setProgramName(""); // Reset program selection
    //     setSubjects([]); // Clear subjects when department changes
    //     if (name) {
    //         fetchPrograms(name);
    //     } else {
    //         setPrograms([]);
    //     }
    // };

    // const handleProgramChange = (name: string) => {
    //     setProgramName(name);
    //     if (name) {
    //         fetchSubjects(name);
    //     } else {
    //         setSubjects([]);
    //     }
    // };

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

    const handleActionChange = (action: string, subject: Subject) => {
        if (action === "Add Book Reference") {
            toggleBookRefRec(subject);
        } else if (action === "Update Book Reference") {
            // Handle the update logic here
            alert(`WORK IN PROGRESS`);
        }
    };

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
                    Manage Book References
                </Typography>

                <Line />

                <Box className={styles.actionBar}>
                    <Box className={styles.searchBox}>
                        <TextField
                            placeholder="Search..."
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon className={styles.searchIcon} />,
                            }}
                        />
                    </Box>

                    <Box className={styles.filterBox}>
                        {/* <Select
                            value={departmentName}
                            onChange={(e) => handleDepartmentChange(e.target.value)}
                            displayEmpty
                            size="small"
                            sx={{ width: 300, marginRight: 2 }}
                        >
                            <MenuItem value="" disabled>
                                Select Department
                            </MenuItem>
                            {departments.map((department) => (
                                <MenuItem key={department.id} value={department.name}>
                                    {department.name}
                                </MenuItem>
                            ))}
                        </Select>

                        <Select
                            value={programName}
                            onChange={(e) => handleProgramChange(e.target.value)}
                            displayEmpty
                            size="small"
                            sx={{ width: 300 }}
                        >
                            <MenuItem value="" disabled>
                                Select Program
                            </MenuItem>
                            {programs.map((program) => (
                                <MenuItem key={program.id} value={program.name}>
                                    {program.name}
                                </MenuItem>
                            ))}
                        </Select> */}
                    </Box>
                </Box>

                <TableContainer
                    component={Paper}
                    className={styles.tableContainer}
                    sx={{ maxHeight: "60vh", overflowY: "auto" }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Program</strong></TableCell>
                                <TableCell><strong>Subject</strong></TableCell>
                                <TableCell><strong>Year</strong></TableCell>
                                {/* <TableCell>Status</TableCell> */}
                                <TableCell><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No subjects to display. Please select a department and program to view the subjects.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subjects.map((subject) => (
                                    <TableRow key={subject.id}>
                                        <TableCell width="350px">{subject.program_name || "N/A"}</TableCell>
                                        <TableCell width="300px">{subject.subject_name || "N/A"}</TableCell>
                                        <TableCell>{convertYearToString(subject.year)}</TableCell>
                                        <TableCell>
                                            <Select
                                                value=""
                                                displayEmpty
                                                size="small"
                                                onChange={(e) => handleActionChange(e.target.value, subject)}
                                                sx={{ width: 200 }}
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Action
                                                </MenuItem>
                                                <MenuItem value="Add Book Reference">Add Book Reference</MenuItem>
                                                <MenuItem value="Update Book Reference">Update Book Reference</MenuItem>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {selectedSubject && <BookRefRec subject={selectedSubject} onClose={() => toggleBookRefRec(null)} />}

            </Container>
            <Copyright />
        </Box>
    );
};

export default ManageBookReference;
