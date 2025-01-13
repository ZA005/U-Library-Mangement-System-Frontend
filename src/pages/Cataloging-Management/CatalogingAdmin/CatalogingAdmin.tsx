import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import Line from '../../../components/Line/Line';
import styles from './styles.module.css';
import SearchBar from '../../../components/SearchBar/Searchbar';

const CatalogingAdmin: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header buttons={<></>} />

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
                <SearchBar />



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
                    </Box>
                </Box>
            </Container>

            {/* Footer */}
            <Footer />
        </Box>
    );
};

export default CatalogingAdmin;
