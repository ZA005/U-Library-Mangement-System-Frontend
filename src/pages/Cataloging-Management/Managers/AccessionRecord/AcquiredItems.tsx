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
import Header from '../../../../components/Header/Header';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../../../../components/Sidebar';
import Line from '../../../../components/Line/Line';
import { useLocation, useNavigate } from 'react-router-dom';
import Copyright from '../../../../components/Footer/Copyright';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { useCSVParser } from './useParseAcquisition';
import { AcquisitionRecord, addRecords, fetchAllPendingCatalogRecords, updateStatus } from '../../../../services/AcquisitionService';

const AcquiredItems: React.FC = () => {
    const location = useLocation();
    const [array, setArray] = useState<AcquisitionRecord[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const [canImport, setCanImport] = useState<boolean>(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 5;
    const { isLoading: csvParseLoading, errorMessage: csvParseErrorMsg, successMessage: csvParseSuccessMsg, parseStatus, validateAndParseCSV } = useCSVParser();
    const navigate = useNavigate();

    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                if (location.state?.success) {
                    const success = await updateStatus(location.state.id);
                    if (success) {
                        openSnackbar(`${location.state.title} has been successfully cataloged`, 'success');
                    } else {
                        openSnackbar(`Failed to catalog ${location.state.title}`, 'error');
                    }
                    // Reset location state
                    navigate(location.pathname, { replace: true });
                }
                const records = await fetchAllPendingCatalogRecords();
                setArray(records);
                // setCanImport(records.length === 0);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(`Error loading records from server: ${error.message}`);
                } else {
                    setErrorMessage('An unexpected error occurred while loading records.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [openSnackbar, navigate, location]);

    const handleSideBarClick = () => {
        if (!isLoading) setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        if (!isLoading) setSidebarOpen(false);
    };

    const handleSelectChange = (value: string, item: AcquisitionRecord) => {
        if (!isLoading) {
            setSelectedOption(value);
            if (value === "copyCatalog") {
                // Navigate to BookSearch.tsx with local catalog search parameters
                const advancedSearchParams = {
                    criteria: [
                        { idx: "q", searchTerm: item.book_title, operator: "AND" },
                        { idx: "intitle", searchTerm: item.book_title, operator: "AND" },
                        { idx: "isbn", searchTerm: item.isbn, operator: "AND" },
                        { idx: "inpublisher", searchTerm: item.publisher, operator: "AND" },
                    ],
                    individualLibrary: null,
                };
                navigate("/user/catalog/management/search-title", {
                    state: { query: advancedSearchParams, books: [], source: "All libraries", modalParams: advancedSearchParams, bookData: item },
                });
            } else if (value === 'addToCatalog') {
                navigate('/admin/catalog/management/book-form-fast', {
                    state: { bookData: item }
                });
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // if (!canImport) {
        //     setErrorMessage('Please catalog all pending records before importing new ones.');
        //     return;
        // }

        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFileToUpload(selectedFile);
            setErrorMessage(null);
            setOpenDialog(true);
            (e.target as HTMLInputElement).value = '';
        }
    };

    const handleConfirmUpload = async () => {
        if (fileToUpload) {
            setIsLoading(true);
            setOpenDialog(false);

            try {
                await validateAndParseCSV(fileToUpload, (allRecords) => {
                    setArray(allRecords);
                    // setCanImport(allRecords.length === 0);
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (csvParseErrorMsg) {
            openSnackbar(csvParseErrorMsg, 'error');
        } else if (csvParseSuccessMsg && parseStatus) {
            openSnackbar(csvParseSuccessMsg, 'success');
        }
    }, [csvParseErrorMsg, csvParseSuccessMsg, parseStatus, openSnackbar]);

    const handleCancelUpload = () => {
        setOpenDialog(false);
        setFileToUpload(null);
    };

    useEffect(() => {
        // console.log('State update:', openDialog, fileToUpload);
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
                    Manage Accession
                </Typography>
                <Line />
                <Box className={styles.actionBar}>
                    <Button
                        variant="outlined"
                        component="label"
                        disabled={isLoading}
                    // startIcon={!canImport && <Typography variant="body2" color="error" sx={{ mt: -0.5 }}>!</Typography>}
                    >
                        Choose File
                        <Input
                            type="file"
                            inputProps={{ accept: '.csv' }}
                            sx={{ display: 'none' }}
                            onChange={handleFileChange}
                            disabled={isLoading}
                        />
                    </Button>
                    {/* {!canImport && (
                        <Typography variant="body2" color="error" sx={{ ml: 2, mt: 1 }}>
                            Catalog all pending records first.
                        </Typography>
                    )} */}
                </Box>
                {errorMessage && (
                    <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                        {errorMessage}
                    </Typography>
                )}
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
                {array.length === 0 && !isLoading && !errorMessage ? (
                    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                        <Typography variant="body1">
                            No pending records to catalog. You can import new records with the "Choose File" button above.
                        </Typography>
                    </Box>
                ) : (
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
                                    <TableCell style={{ minWidth: '150px' }}><strong>Book Title</strong></TableCell>
                                    <TableCell><strong>ISBN</strong></TableCell>
                                    <TableCell><strong>Price</strong></TableCell>
                                    <TableCell><strong>Purchase Date</strong></TableCell>
                                    <TableCell><strong>Acquired Date</strong></TableCell>
                                    <TableCell><strong>Vendor Name</strong></TableCell>
                                    <TableCell><strong>Vendor Location</strong></TableCell>
                                    <TableCell><strong>Funding Source</strong></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {array.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, index) => (
                                    <TableRow key={item.id || index}>
                                        {/* Exclude 'id' from mapping */}
                                        {Object.entries(item).filter(([key]) => key !== 'id'
                                            && key !== 'status'
                                            && key !== 'publisher'
                                            && key !== 'edition'
                                            && key !== 'published_date'
                                        ).map(([, value], idx) => (
                                            <TableCell key={idx}>{value}</TableCell>
                                        ))}
                                        <TableCell>
                                            <Select
                                                value={selectedOption}
                                                onChange={(e) => handleSelectChange(e.target.value, item)}
                                                displayEmpty
                                                className={styles.select}
                                                disabled={isLoading}
                                            >
                                                <MenuItem value="" disabled>
                                                    Action
                                                </MenuItem>
                                                <MenuItem value="copyCatalog">Copy Catalog</MenuItem>
                                                <MenuItem value="addToCatalog">Fast Catalog</MenuItem>

                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={Math.ceil(array.length / itemsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                    />
                </Box>
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
            <Dialog
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
            </Dialog>
            <Copyright />
        </Box>
    );
};

export default AcquiredItems;