/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
    Alert,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Container,
    IconButton,
    Select,
    MenuItem,
    Input,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Pagination,
    Snackbar,
} from '@mui/material';
import styles from './styles.module.css';
import Header from '../../../components/Header/Header';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../../../components/Sidebar';
import Line from '../../../components/Line/Line';
import { useLocation, useNavigate } from 'react-router-dom';
import Copyright from '../../../components/Footer/Copyright';
import { useSnackbar } from '../../../hooks/useSnackbar';

const UploadCourseReference: React.FC = () => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [canImport, setCanImport] = useState<boolean>(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 5;

    const navigate = useNavigate();

    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();

    const handleSideBarClick = () => {
        if (!isLoading) setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        if (!isLoading) setSidebarOpen(false);
    };


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canImport) {
            setErrorMessage('Please catalog all pending records before importing new ones.');
            return;
        }

        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFileToUpload(selectedFile);
            setErrorMessage(null);
            setOpenDialog(true);
            (e.target as HTMLInputElement).value = '';
        }
    };

    const handleCancelUpload = () => {
        setOpenDialog(false);
        setFileToUpload(null);
    };



    useEffect(() => {
    }, [openDialog, fileToUpload]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Box className={styles.rootContainer}>
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" className={styles.container}>
                <Header
                    buttons={
                        <IconButton onClick={handleSideBarClick} disabled={isLoading}>
                            <MenuIcon className={styles.menuIcon} />
                        </IconButton>
                    }
                />
                <Typography variant="h4" gutterBottom className={styles.title}>
                    Course References
                </Typography>
                <Line />
                <Box className={styles.actionBar}>
                    <Button
                        variant="outlined"
                        component="label"
                        disabled={isLoading || !canImport}
                        startIcon={!canImport && <Typography variant="body2" color="error" sx={{ mt: -0.5 }}>!</Typography>}
                    >
                        Choose File
                        <Input
                            type="file"
                            inputProps={{ accept: '.csv' }}
                            sx={{ display: 'none' }}
                            onChange={handleFileChange}
                            disabled={isLoading || !canImport}
                        />
                    </Button>
                    {/* {!canImport && (
                        <Typography variant="body2" color="error" sx={{ ml: 2, mt: 1 }}>
                            Catalog all pending records first.
                        </Typography>
                    )} */}
                </Box>
                {/* {errorMessage && (
                    <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                        {errorMessage}
                    </Typography>
                )} */}
                {isLoading && (
                    <Box
                        position="fixed" top="0" left="0" width="100%" height="100%"
                        bgcolor="rgba(0, 0, 0, 0.5)" zIndex="1000"
                        display="flex" justifyContent="center" alignItems="center"
                    >
                        <CircularProgress size={60} />
                        <Typography variant="body1" sx={{ color: 'white', marginLeft: 2 }}>
                            Importing CSV, please wait...
                        </Typography>
                    </Box>
                )}

                <TableContainer
                    component={Paper}
                    className={styles.tableContainer}
                    sx={{
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        overflowX: 'auto',
                        pointerEvents: isLoading ? 'none' : 'auto'
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Department</strong></TableCell>
                                <TableCell><strong>Program</strong></TableCell>
                                <TableCell><strong>Subject</strong></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={Math.ceil(array.length / itemsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                    />
                </Box> */}
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <Alert onClose={closeSnackbar} severity={snackbarStatus}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {/* <Dialog
                open={openDialog}
                onClose={handleCancelUpload}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm CSV Import"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to import this CSV file? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelUpload}>Cancel</Button>
                    <Button onClick={handleConfirmUpload} autoFocus>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog> */}
            <Copyright />
        </Box>
    );
};

export default UploadCourseReference;