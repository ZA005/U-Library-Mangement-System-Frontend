/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Line from '../../../components/Line/Line';
import styles from './styles.module.css';
import MenuIcon from "@mui/icons-material/Menu";
import SearchBar from '../../../components/SearchBar/Searchbar';
import Sidebar from '../../../components/Sidebar';
import Copyright from '../../../components/Footer/Copyright';
import { Book } from '../../../model/Book';

const CatalogingAdmin: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { query: string; books: Book[]; source: string };
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [books, setBooks] = useState<Book[]>(state?.books || []);

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };
    const updateBooks = (newBooks: Book[]) => {
        setBooks(newBooks);
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

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ fontSize: { xs: '1.8rem', sm: '2rem', md: '2.4rem' } }}
                        fontWeight="bold"
                    >
                        Catalog Admin
                    </Typography>

                </Box>
                <Line />
                <SearchBar onSearch={updateBooks} />



                <Box className={styles.container}>
                    {/* Left Content */}
                    <Box className={styles.leftContent}>
                        <Typography variant="body1">
                            Cataloging in library management organizes and describes library materials systematically, enabling easy identification and retrieval.
                        </Typography>

                        <Typography variant="body1">✨ What You Can Do Here:</Typography>
                        <Typography variant="body1">As an Admin You Can:</Typography>
                        <ul>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Add New Materials:</strong> Register books and other resources with detailed metadata.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Classify Resources:</strong> Assign categories and call numbers for streamlined organization.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Update Records:</strong> Edit or remove outdated or incorrect catalog entries.
                                </Typography>
                            </li>
                            <li className={styles.listItem}>
                                <Typography variant="body1">
                                    <strong>Search Optimization:</strong> Enhance resource discoverability with precise indexing.
                                </Typography>
                            </li>
                        </ul>
                    </Box>

                    {/* Right Content */}
                    <Box className={styles.rightContent}>
                        <Box className={styles.buttonContainer}>
                            <button
                                className={styles.manageButton}
                                onClick={() => navigate('/admin/catalog/management/accesion-record')}
                            >
                                Manage Catalog
                            </button>
                        </Box>

                        <Box className={styles.buttonContainer}>
                            <button
                                className={styles.manageButton}
                                onClick={() => navigate('/admin/catalog/management/book-weeding')}
                            >
                                Book Weeding
                            </button>
                        </Box>
                    </Box>
                </Box>
            </Container>

            <Copyright />
        </Box>
    );
};

export default CatalogingAdmin;
