import React, { useState, useEffect } from "react";
import { Box, Typography, Container, IconButton, Button } from "@mui/material";
import { useProgramsByDepartment } from "../../hooks/usePrograms";
import { useDepartments } from "../../hooks/useDepartments";
import Header from "../../components/Header/Header";
import Copyright from "../../components/Footer/Copyright";
import Line from "../../components/Line/Line";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../../components/Sidebar";
import styles from "./styles.module.css";
import { getAllProgramsByDepartment, Program } from "../../services/Curriculum/ProgramService";

const UniversityCurriculumPage: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);
    const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments(true);
    const [programsByDepartment, setProgramsByDepartment] = useState<{ [key: string]: Program[] }>({});
    const [programsLoading, setProgramsLoading] = useState<{ [key: string]: boolean }>({});
    const [programsError, setProgramsError] = useState<{ [key: string]: string | null }>({});

    const navigate = useNavigate();

    const handleToggle = async (departmentId: string) => {
        if (expandedDepartment === departmentId) {
            setExpandedDepartment(null);
        } else {
            setExpandedDepartment(departmentId);

            if (!programsByDepartment[departmentId]) {
                setProgramsLoading((prev) => ({ ...prev, [departmentId]: true }));
                setProgramsError((prev) => ({ ...prev, [departmentId]: null }));

                try {
                    const fetchedPrograms = await getAllProgramsByDepartment(departmentId);
                    setProgramsByDepartment((prev) => ({
                        ...prev,
                        [departmentId]: fetchedPrograms.filter(program => program.status === 1),
                    }));
                } catch (error) {
                    console.error(`Error fetching programs for department ${departmentId}:`, error);
                    setProgramsError((prev) => ({
                        ...prev,
                        [departmentId]: "Failed to load programs.",
                    }));
                } finally {
                    setProgramsLoading((prev) => ({ ...prev, [departmentId]: false }));
                }
            }
        }
    };

    const handleViewSubjects = (department: string, program: Program) => {
        const route = `/university/curriculum/${department.toLowerCase().replace(/\s/g, "-")}/${program.description.toLowerCase().replace(/\s/g, "-")}`;
        navigate(route, { state: { program } });
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Sidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header
                    buttons={
                        <>
                            <Button
                                variant="text"
                                color="inherit"
                                onClick={() => { }}
                                sx={{ color: '#d32f2f' }}
                            >
                                Back
                            </Button>

                            <IconButton onClick={() => setSidebarOpen(!isSidebarOpen)}>
                                <MenuIcon style={{ color: "#EA4040" }} />
                            </IconButton>
                        </>
                    }
                />

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                    fontWeight="bold"
                >
                    Courses and Programs
                </Typography>
                <Line />

                <Box className={styles.container}>
                    <Box className={styles.leftContent} sx={{ textAlign: "justify" }}>
                        <Typography variant="body1">
                            Welcome to the University Curriculum, your gateway to discovering and managing academic programs across various disciplines. This platform makes it easy for students, faculty, and administrators to explore the structure of each academic field and access the courses that define them.
                        </Typography>

                        <Typography variant="body1">
                            With just a few clicks, you can:
                        </Typography>

                        <ul>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Browse Departments:</strong> Explore academic departments such as Art and Sciences, Business and Accountancy, Computer Studies, and more.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>View Courses:</strong> Dive into the courses offered under each department to find detailed information and ensure students have access to all required resources.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Support Learning Goals:</strong> Whether you're a student planning your educational journey or an educator organizing resources, this page provides a clear, streamlined view of all academic opportunities.
                                </Typography>
                            </li>
                        </ul>
                    </Box>

                    <Box className={styles.rightContent}>
                        {departmentsLoading ? (
                            <Typography variant="body2">Loading departments...</Typography>
                        ) : departmentsError ? (
                            <Typography variant="body2" color="error">{departmentsError}</Typography>
                        ) : (
                            departments.map((department) => (
                                <Box key={department.id} mb={2} width="100%">
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        borderBottom="1px solid #ccc"
                                        pb={1}
                                        mb={1}
                                    >
                                        <Typography variant="body1" fontWeight="bold">
                                            {department.name}
                                        </Typography>
                                        <Button
                                            onClick={() => handleToggle(department.id)}
                                            sx={{ color: "#EA4040", textTransform: "none" }}
                                        >
                                            {expandedDepartment === department.id ? "Minimize" : "View Courses"}
                                        </Button>
                                    </Box>
                                    {expandedDepartment === department.id && (
                                        <Box pl={2}>
                                            {programsLoading[department.id] ? (
                                                <Typography variant="body2">Loading programs...</Typography>
                                            ) : programsError[department.id] ? (
                                                <Typography variant="body2" color="error">{programsError[department.id]}</Typography>
                                            ) : programsByDepartment[department.id]?.length > 0 ? (
                                                programsByDepartment[department.id].map((program) => (
                                                    <Box
                                                        key={program.prog_id}
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        mb={1}
                                                    >
                                                        <Typography variant="body2">
                                                            {program.description}
                                                        </Typography>
                                                        <Button
                                                            sx={{ color: "#EA4040", textTransform: "none" }}
                                                            onClick={() => handleViewSubjects(department.name, program)}
                                                        >
                                                            View Subjects
                                                        </Button>
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="textSecondary">
                                                    No programs available.
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>
            </Container>
            <Copyright />
        </Box>
    );
};

export default UniversityCurriculumPage;
