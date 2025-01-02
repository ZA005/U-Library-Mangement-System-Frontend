import React, { useState } from "react";
import { Box, Typography, Container, IconButton, Button } from "@mui/material";
import Header from "../../components/Header/Header";
import Copyright from "../../components/Footer/Copyright";
import Line from "../../components/Line/Line";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../../components/Sidebar";
import styles from "./styles.module.css";

const UniversityCurriculumPage: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleViewSubjects = (department: string, program: string) => {
        const route = `/${department.toLowerCase().replace(/\s/g, "-")}/${program.toLowerCase().replace(/\s/g, "-")}`;
        navigate(route);
    };
    const departments = [
        {
            name: "Art and Sciences",
            programs: [],
        },
        {
            name: "Business and Accountancy",
            programs: [],
        },
        {
            name: "Computer Studies",
            programs: [
                "Associate of Computer Technology",
                "Bachelor of Science in Computer Science",
                "Bachelor of Science in Information Technology",
                "Bachelor of Library and Information Science",
            ],
        },
        {
            name: "Criminal Justice Education",
            programs: [],
        },
        {
            name: "Education",
            programs: [],
        },
        {
            name: "Engineering and Architecture",
            programs: [],
        },
        {
            name: "Nursing",
            programs: [],
        },
    ];

    const handleToggle = (departmentName: string) => {
        if (expandedDepartment === departmentName) {
            setExpandedDepartment(null);
        } else {
            setExpandedDepartment(departmentName);
        }
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Sidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header
                    buttons={
                        <IconButton onClick={() => setSidebarOpen(!isSidebarOpen)}>
                            <MenuIcon style={{ color: "#EA4040" }} />
                        </IconButton>
                    }
                />

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                    fontWeight="bold"
                >
                    University Curriculum
                </Typography>
                <Line />

                <Box className={styles.container}>
                    <Box className={styles.leftContent}>
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
                        {departments.map((department) => (
                            <Box key={department.name} mb={2} width="100%">
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
                                        onClick={() => handleToggle(department.name)}
                                        sx={{ color: "#EA4040", textTransform: "none" }}
                                    >
                                        {expandedDepartment === department.name ? "Minimize" : "View Courses"}
                                    </Button>
                                </Box>
                                {expandedDepartment === department.name && (
                                    <Box pl={2}>
                                        {department.programs.length > 0 ? (
                                            department.programs.map((program, index) => (
                                                <Box
                                                    key={index}
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    mb={1}
                                                >
                                                    <Typography variant="body2">
                                                        {program}
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
                        ))}
                    </Box>
                </Box>
            </Container>
            <Copyright />
        </Box>
    );
};

export default UniversityCurriculumPage;
