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
import { AcquisitionRecord, addRecords, fetchAllPendingCatalogRecords, updateStatus } from '../../../../services/AcquisitionService';

const AcquiredItems: React.FC = () => {
    const location = useLocation();
    const [array, setArray] = useState<AcquisitionRecord[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
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

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                if (location.state?.id) {
                    const success = await updateStatus(location.state.id);
                    if (success) {
                        openSnackbar(`${location.state.title} has been successfully cataloged`, 'success');
                    } else {
                        openSnackbar(`Failed to catalog ${location.state.title}`, 'error');
                    }
                }
                const records = await fetchAllPendingCatalogRecords();
                setArray(records);
                setCanImport(records.length === 0);
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
    }, [location.state, openSnackbar]);

    const handleSideBarClick = () => {
        if (!isLoading) setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        if (!isLoading) setSidebarOpen(false);
    };

    const handleSelectChange = (value: string, item: AcquisitionRecord) => {
        if (!isLoading) {
            setSelectedOption(value);
            if (value === 'searchGoogleBooks') {
                navigate('/admin/catalog/management/search-title', {
                    state: { query: item.book_title, books: item, source: 'Google Books' },
                });
            } else if (value === "searchLocalCatalog") {
                // Navigate to BookSearch.tsx with local catalog search parameters
                const advancedSearchParams = {
                    criteria: [
                        { idx: "q", searchTerm: item.book_title, operator: "AND" },
                        { idx: "isbn", searchTerm: item.isbn, operator: "AND" },
                        { idx: "inpublisher", searchTerm: item.publisher, operator: "AND" },
                    ],
                    individualLibrary: null,
                };
                navigate("/admin/catalog/management/search-title", {
                    state: { query: advancedSearchParams, books: [], source: "All libraries" },
                });
            } else if (value === 'addToCatalog') {
                navigate('/admin/catalog/management/marc-record/add', {
                    state: { bookData: item }
                });
            }
        }
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

    const handleConfirmUpload = async () => {
        if (fileToUpload) {
            setIsLoading(true);
            setOpenDialog(false);

            const reader = new FileReader();
            reader.onload = async (event) => {
                const csvString = event.target?.result as string;
                await validateAndParseCSV(csvString);
            };
            reader.readAsText(fileToUpload);
        }
    };

    const handleCancelUpload = () => {
        setOpenDialog(false);
        setFileToUpload(null);
    };

    const validateAndParseCSV = async (csvString: string) => {
        const expectedHeaders = [
            'book_title', 'isbn', 'publisher', 'edition', 'series',
            'purchase_price', 'purchase_date', 'acquired_date', 'vendor',
            'vendor_location', 'funding_source'
        ];

        const resetStates = () => {
            setOpenDialog(false);
            setFileToUpload(null);
        };

        const handleError = (message: string, snackbarMsg: string) => {
            setErrorMessage(message);
            openSnackbar(snackbarMsg, 'error');
            resetStates();
            setIsLoading(false);
        };

        Papa.parse(csvString, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                if (result.data.length > 0 && JSON.stringify(Object.keys(result.data[0])) === JSON.stringify(expectedHeaders)) {
                    const parsedData = result.data as unknown as AcquisitionRecord[];
                    try {
                        await addRecords(parsedData);
                        openSnackbar("CSV Parsed Successfully!", "success");
                        const allRecords = await fetchAllPendingCatalogRecords();
                        setArray(allRecords);
                        setCanImport(allRecords.length === 0);
                    } catch (error) {
                        handleError(
                            error instanceof Error ? `Failed to add records to the server: ${error.message}` : 'An unexpected error occurred while adding records.',
                            error instanceof Error ? "Failed to add records to the server!" : "An unexpected error occurred while adding records!"
                        );
                        return;
                    }
                } else {
                    handleError('CSV file headers do not match the expected format or the file is empty.', 'CSV file headers incorrect or file empty!');
                    return;
                }
                setIsLoading(false);
                // console.log('After processing:', openDialog, fileToUpload);
            },
            error: (err) => {
                handleError(`An error occurred while parsing the CSV file: ${err.message}`, `Error parsing CSV file!`);
            }
        });
    };

    useEffect(() => {
        // console.log('State update:', openDialog, fileToUpload);
    }, [openDialog, fileToUpload]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
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
                    Accession
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
                    {!canImport && (
                        <Typography variant="body2" color="error" sx={{ ml: 2, mt: 1 }}>
                            Catalog all pending records first.
                        </Typography>
                    )}
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
                                    <TableCell><strong>Publisher</strong></TableCell>
                                    <TableCell><strong>Edition</strong></TableCell>
                                    <TableCell><strong>Series</strong></TableCell>
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
                                        {Object.entries(item).filter(([key]) => key !== 'id' && key !== 'status').map(([, value], idx) => (
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
                                                <MenuItem value="searchGoogleBooks">Search Google Books</MenuItem>
                                                <MenuItem value="searchLocalCatalog">Search Local Catalog</MenuItem>
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