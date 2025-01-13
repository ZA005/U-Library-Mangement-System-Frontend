import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Container, IconButton, Typography, } from "@mui/material";
import Header from '../../components/Header/Header';
import MenuIcon from "@mui/icons-material/Menu";
import Footer from '../../components/Footer/Footer';
import Line from "../../components/Line/Line";
import styles from "./styles.module.css";
import Sidebar from '../../components/Sidebar';

const LandingPage: React.FC = () => {
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
                    Admin Landing Page
                </Typography>
                <Line />

                <Box className={styles.container}>
                    {/* Left Content */}
                    <Box className={styles.leftContent}>
                        <Typography variant="body1">
                            Welcome! This is the Admins Dashboard, your central hub for managing the Library Management System (LMS).
                        </Typography>

                        <Typography variant="body1">
                            With just a few clicks, you can:
                        </Typography>
                        <ul>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Cataloguing:</strong> Organize and maintain the library's collection for easy access.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Circulation:</strong> Manage lending, returns, and user accounts.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Curriculum Management:</strong> Provide quick access to resource information and recommendations.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Aquisition:</strong> Handle procurement of books and digital materials.
                                </Typography>
                            </li>
                        </ul>

                        {/* Additional Links */}
                        <Box className={styles.linksContainer}>
                            <Box className={styles.additionalLinks}>
                                <ul>
                                    <li><a href="/help" onClick={() => navigate("/advanced-search")}>Need help? Click here for help!</a></li>
                                    <li><a href="/advanced-search" onClick={() => navigate("/advanced-search")}>Advanced Search</a></li>
                                    <li><a href="/about-lms" onClick={() => navigate("/about-lms")}>About LMS</a></li>
                                    <li><a href="/lms-administration" onClick={() => navigate("/lms-administration")}>LMS Administration</a></li>
                                    <li><a href="/authorities" onClick={() => navigate("/authorities")}>Authorities</a></li>
                                    <li><a href="/patrons" onClick={() => navigate("/patrons")}>Patrons</a></li>
                                    <li><a href="/serials" onClick={() => navigate("/serials")}>Serials</a></li>
                                </ul>
                            </Box>
                        </Box>
                    </Box>


                    {/* Right Content */}
                    <Box className={styles.rightContent}>
                        <Box className={styles.buttonContainer}>
                            <button className={styles.manageButton}
                                onClick={() => navigate('/admin/catalog/management')}>
                                Cataloging
                            </button>
                        </Box>

                        <Box className={styles.buttonContainer}>
                            <button
                                className={styles.manageButton}
                                onClick={() => navigate('/admin/circulation/management/page')}
                            >
                                Circulation
                            </button>
                        </Box>


                        <Box className={styles.buttonContainer}>
                            <button
                                className={styles.manageButton}
                                onClick={() => navigate('/admin/curriculum/management/page')}
                            >
                                Curriculum Management
                            </button>
                        </Box>


                        <Box className={styles.buttonContainer}>
                            <button className={styles.manageButton}>
                                Aquisition
                            </button>
                        </Box>
                    </Box>
                </Box>
            </Container>

            {/* Footer */}
            <Footer />
        </Box>
    );
};

export default LandingPage;
