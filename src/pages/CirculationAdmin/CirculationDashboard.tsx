import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Icon } from "@mui/material";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Line from "../../components/Line/Line";
import HistoryIcon from '@mui/icons-material/History';
import ManageCirculationIcon from "@mui/icons-material/AllInbox";
import ManageReservationIcon from "@mui/icons-material/EventNote";
import OverseeOverdueIcon from "@mui/icons-material/Warning";
import styles from "./styles.module.css";

const CirculationDashboard: React.FC = () => {
    const navigate = useNavigate();

    // Navigation Handlers
    const viewTransactionHistory = () => navigate("/admin/circulation/management/history");
    const handleManageCirculation = () => navigate("/admin/manage-circulation");
    const handleManageReservation = () => navigate("/admin/manage-reservation");
    const handleOverseeOverdues = () => navigate("/admin/oversee-overdue");

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header buttons={<></>} />

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                    fontWeight="bold"
                >
                    Circulation Admin
                </Typography>
                <Line />

                <Box className={styles.container}>
                    {/* Left Content */}
                    <Box className={styles.leftContent}>
                        <Typography variant="body1">
                            📚 What is Circulation? Circulation is at the heart of library operations, ensuring the smooth flow of books and resources between the library and its users. Whether you're issuing, returning, or reserving materials, this system simplifies and automates the process for efficiency and accuracy.
                        </Typography>

                        <Typography variant="body1">
                            ✨ What You Can Do Here:
                        </Typography>
                        <Typography variant="body1">
                            As an Admin You Can:
                        </Typography>
                        <ul>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Issue Book:</strong> Quickly lend books to users while keeping detailed records.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Return Book:</strong> Record returned items and update the library inventory.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Renew Book:</strong> Extend borrowing periods seamlessly.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Manage Reservations:</strong> Approve or deny user requests for reserved items.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Overdues:</strong> Track late returns and handle fines efficiently.
                                </Typography>
                            </li>
                        </ul>
                    </Box>

                    {/* Right Content */}
                    <Box className={styles.rightContent}>
                        <Box className={styles.buttonContainer}>
                            <Icon className={styles.icon}>
                                <HistoryIcon />
                            </Icon>
                            <button
                                className={styles.manageButton}
                                onClick={viewTransactionHistory}
                            >
                                Transaction History
                            </button>
                        </Box>

                        <Box className={styles.buttonContainer}>
                            <Icon className={styles.icon}>
                                <ManageCirculationIcon />
                            </Icon>
                            <button
                                className={styles.manageButton}
                                onClick={handleManageCirculation}
                            >
                                Manage Circulation
                            </button>
                        </Box>

                        <Box className={styles.buttonContainer}>
                            <Icon className={styles.icon}>
                                <ManageReservationIcon />
                            </Icon>
                            <button
                                className={styles.manageButton}
                                onClick={handleManageReservation}
                            >
                                Manage Reservation
                            </button>
                        </Box>

                        <Box className={styles.buttonContainer}>
                            <Icon className={styles.icon}>
                                <OverseeOverdueIcon />
                            </Icon>
                            <button
                                className={styles.manageButton}
                                onClick={handleOverseeOverdues}
                            >
                                Oversee Overdues
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

export default CirculationDashboard;
