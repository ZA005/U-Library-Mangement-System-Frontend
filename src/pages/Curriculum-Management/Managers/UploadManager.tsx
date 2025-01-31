import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Container, Typography, Icon } from "@mui/material";
import Header from "../../../components/Header/Header";
import Copyright from "../../../components/Footer/Copyright";
import MenuIcon from "@mui/icons-material/Menu";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BookIcon from "@mui/icons-material/Book";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Line from "../../../components/Line/Line";
import styles from "../styles.module.css";
import Sidebar from "../../../components/Sidebar";

const UploadManager: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header
                    buttons={
                        <>
                            <IconButton onClick={handleSideBarClick}>
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
                    Upload Manager
                </Typography>
                <Line />

                <Box className={styles.container}>
                    {/* Left Content */}
                    <Box className={styles.leftContent} sx={{ textAlign: "justify" }}>
                        <Typography variant="body1">
                            This is your all-in-one tool designed to simplify how you manage
                            and organize your library's academic curriculum. Whether you're an
                            administrator, librarian, or faculty member, this interface is
                            here to help you stay on top of everything.
                        </Typography>

                        <Typography variant="body1">
                            With just a few clicks, you can:
                        </Typography>
                        <ul>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Upload Departments:</strong> Import and manage university departments via CSV file, including names and codes. Upload and view the data in a table for easy organization and updates.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Upload Programs:</strong> Upload and view academic programs with a CSV file. Manage details like code, descriptions, department and status, ensuring accurate and up-to-date information in a table view.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Upload Curriculum:</strong> Import and update curriculum data, including program, revision number, effectivity semester, effectivity school year, and status. Track changes of the curriculum data, all accessible and manageable through a table for quick updates.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Upload Courses:</strong> Upload and view course data, including codes, curriculum, name, and year level, using a CSV file. Easily manage and view course details in a table for consistency and relevance.
                                </Typography>
                            </li>
                        </ul>

                    </Box>


                    {/* Right Content */}
                    <Box className={styles.rightContent}>
                        <Box className={styles.buttonContainer}>
                            <Icon className={styles.icon} fontSize="large">
                                <LocationCityIcon />
                            </Icon>
                            <button
                                className={styles.manageButton}
                                onClick={() => navigate('/admin/curriculum/management/departments')}
                            >
                                Upload Departments
                            </button>
                        </Box>

                        <Box className={styles.buttonContainer}>
                            <Icon className={styles.icon} fontSize="large">
                                <LocalLibraryIcon />
                            </Icon>
                            <button
                                className={styles.manageButton}
                                onClick={() => navigate('/admin/curriculum/management/programs')}
                            >
                                Upload Programs
                            </button>
                        </Box>

                        <Box className={styles.buttonContainer}>
                            <Icon className={styles.icon} fontSize="large">
                                <BookIcon />
                            </Icon>
                            <button
                                className={styles.manageButton}
                                onClick={() => navigate('/admin/curriculum/management/subjects')}
                            >
                                Upload Curriculum
                            </button>
                        </Box>

                        <Box className={styles.buttonContainer}>
                            <Icon className={styles.icon} fontSize="large">
                                <AutoStoriesIcon />
                            </Icon>
                            <button
                                className={styles.manageButton}
                                onClick={() => navigate('/admin/curriculum/management/reference')}
                            >
                                Upload Courses
                            </button>
                        </Box>
                    </Box>
                </Box>
            </Container>
            <Copyright />
        </Box>
    );
};

export default UploadManager;
