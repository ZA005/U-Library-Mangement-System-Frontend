import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Input,
    CircularProgress,
    IconButton,
    Snackbar,
    Alert,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import styles from './styles.module.css';
import Header from '../../../components/Header/Header';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../../../components/Sidebar';
import Line from '../../../components/Line/Line';
import Copyright from '../../../components/Footer/Copyright';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { useCsvUploader } from '../../../hooks/useCsvUploader';
import { Subject, getAllSubjects } from '../../../services/Curriculum/SubjectService';

const UploadCurriculum: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openFileInstructionDialog, setOpenFileInstructionDialog] = useState(false); // New dialog state
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await getAllSubjects();
                setSubjects(data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        fetchSubjects();
    }, []);

    const {
        parsedData,
        isUploading,
        error,
        uploadCsv,
        reset,
    } = useCsvUploader();

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setFileToUpload(file); // Store the selected file
            setOpenFileInstructionDialog(false); // Close the instruction dialog
            setOpenDialog(true); // Open the confirmation dialog
        }
    };

    const handleConfirmUpload = () => {
        if (fileToUpload) {
            uploadCsv(fileToUpload); // Trigger CSV upload and parsing
        }
        setOpenDialog(false); // Close the dialog after confirmation
    };

    const handleCancelUpload = () => {
        setOpenDialog(false); // Close the dialog without uploading
        setFileToUpload(null); // Clear the selected file
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        if (error) {
            openSnackbar(error, 'error'); // Show error snackbar
        }
    }, [error, openSnackbar]);

    useEffect(() => {
        if (parsedData) {
            openSnackbar("CSV successfully uploaded and parsed.", 'success'); // Show success snackbar
        }
    }, [parsedData, openSnackbar]);

    // This function will trigger the file explorer after user confirmation
    const handleOpenFileExplorer = () => {
        const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.click(); // Programmatically open the file explorer
        }
    };

    const filteredSubjects = subjects.filter((subject) =>
        subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.department_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the paginated subjects based on current page
    const paginatedSubjects = filteredSubjects.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );
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
                    University Curriculum
                </Typography>
                <Line />

                <Box className={styles.actionBar}>
                    <Button
                        variant="outlined"
                        component="label"
                        disabled={isUploading} // Disable while uploading
                        onClick={() => setOpenFileInstructionDialog(true)} // Show the instruction dialog when clicked
                    >
                        Choose File
                    </Button>
                    {isUploading && (
                        <Typography variant="body2" color="textSecondary">
                            Uploading and Parsing CSV...
                        </Typography>
                    )}
                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}

                    <Box className={styles.searchBox}>
                        <TextField
                            placeholder="Search..."
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon className={styles.searchIcon} />,
                            }}
                        />
                    </Box>
                </Box>

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
                        height: "60vh", // Fixed height for the table
                        overflowY: 'auto', // Allow vertical scrolling
                        overflowX: 'auto',
                        pointerEvents: isUploading ? 'none' : 'auto',
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell width="250"><strong>Department</strong></TableCell>
                                <TableCell width="450"><strong>Program</strong></TableCell>
                                <TableCell><strong>Subject</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedSubjects.length > 0 ? (
                                paginatedSubjects.map((subject) => (
                                    <TableRow key={subject.id}>
                                        <TableCell>{subject.department_name}</TableCell>
                                        <TableCell>{subject.program_name}</TableCell>
                                        <TableCell>{(subject.subject_name)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body1" sx={{ color: "gray" }}>
                                            No subjects match your search criteria.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <Pagination
                    count={Math.ceil(filteredSubjects.length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{ marginTop: 2, marginBottom: 5, display: 'flex', justifyContent: 'center' }}
                />
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

            {/* File Instruction Dialog */}
            <Dialog
                open={openFileInstructionDialog}
                onClose={() => setOpenFileInstructionDialog(false)}
                aria-labelledby="file-instruction-dialog-title"
                aria-describedby="file-instruction-dialog-description"
            >
                <DialogTitle id="file-instruction-dialog-title">
                    {"Please Ensure Correct CSV Columns"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="file-instruction-dialog-description">
                        Please ensure that the CSV file contains the following columns:
                        <strong>Department, Program, Subjects, and Year</strong>.
                        The column names are case-sensitive, so please double-check their exact spelling and capitalization before proceeding.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFileInstructionDialog(false)} color="primary">
                        Close
                    </Button>
                    <Button onClick={handleOpenFileExplorer} color="primary">
                        Proceed to Choose File
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirm CSV Upload Dialog */}
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

            {/* Hidden file input */}
            <Input
                type="file"
                inputProps={{ accept: '.csv' }}
                id="csv-upload"
                sx={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </Box>
    );
};

export default UploadCurriculum;
