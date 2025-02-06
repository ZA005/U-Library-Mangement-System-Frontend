import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    IconButton,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Input,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../../components/Header/Header";
import Line from "../../../../components/Line/Line";
import Copyright from "../../../../components/Footer/Copyright";
import Sidebar from "../../../../components/Sidebar";
import { useDepartments } from "../../../../hooks/useDepartments";
import { useCsvUploader } from "./useUploadDepartment";
import styles from "../styles.module.css";

const UploadDepartments: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [openDialog, setOpenDialog] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [openFileInstructionDialog, setOpenFileInstructionDialog] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    const { departments, loading, error } = useDepartments(true);
    const { uploadCsv, isUploading, uploadError, parsedData } = useCsvUploader();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarStatus, setSnackbarStatus] = useState<"success" | "error">("success");

    const filteredDepartments = departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setFileToUpload(file); // Store the selected file
            setOpenDialog(true); // Open the confirmation dialog
            (e.target as HTMLInputElement).value = '';
        }
    };

    const handleConfirmUpload = () => {
        if (fileToUpload) {
            uploadCsv(fileToUpload);
        }
        setOpenDialog(false);
    };

    const handleCancelUpload = () => {
        setOpenDialog(false);
        setFileToUpload(null);
    };

    const handleOpenFileExplorer = () => {
        const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.click(); // Programmatically open the file explorer
        }
    };

    useEffect(() => {
        // If there's an upload error, show that message first
        if (uploadError) {
            setSnackbarMessage(uploadError);
            setSnackbarStatus("error");
            setSnackbarOpen(true);
        }
        // If parsing succeeded and there were no upload errors, show the success message
        else if (parsedData) {
            setSnackbarMessage("Departments uploaded successfully!");
            setSnackbarStatus("success");
            setSnackbarOpen(true);

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }, [uploadError, parsedData]);

    return (
        <Box className={styles.rootContainer}>
            <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />
            <Container maxWidth="lg" className={styles.container}>
                <Header
                    buttons={
                        <IconButton onClick={toggleSidebar}>
                            <MenuIcon className={styles.menuIcon} />
                        </IconButton>
                    }
                />
                <Typography variant="h4" gutterBottom className={styles.title}>
                    Upload Departments
                </Typography>

                <Line />

                <Box className={styles.actionBar}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#EA4040",
                            color: "#fff",
                            textTransform: "none",
                            ":hover": { backgroundColor: "#d13333" },
                        }}
                        onClick={() => setOpenFileInstructionDialog(true)} // Show instruction dialog
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload Department"}
                    </Button>
                    <Box className={styles.searchBox}>
                        <TextField
                            placeholder="Search..."
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{ startAdornment: <SearchIcon className={styles.searchIcon} /> }}
                        />
                    </Box>
                </Box>

                {loading ? (
                    <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
                        Loading departments...
                    </Typography>
                ) : error ? (
                    <Typography variant="body1" sx={{ textAlign: "center", color: "red" }}>
                        {error}
                    </Typography>
                ) : (
                    <TableContainer
                        component={Paper}
                        className={styles.tableContainer}
                        sx={{ maxHeight: "60vh", overflowY: "auto" }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>NAME</strong></TableCell>
                                    <TableCell><strong>CODE</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredDepartments.length > 0 ? (
                                    filteredDepartments.map((dept) => (
                                        <TableRow key={dept.id}>
                                            <TableCell width="10%">{dept.id}</TableCell>
                                            <TableCell width="70%">{dept.name}</TableCell>
                                            <TableCell>{dept.code}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            <Typography variant="body1" sx={{ color: "gray" }}>
                                                No departments match your search criteria.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarStatus}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

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
                        Please ensure that the CSV file contains the following columns in order:
                        <strong>dept_id, dept_name, dept_code</strong>.
                        The column names are case-sensitive, so please double-check their exact spelling and capitalization before proceeding.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFileInstructionDialog(false)} color="primary">
                        Close
                    </Button>
                    <Button onClick={() => {
                        setOpenFileInstructionDialog(false); // Close instruction dialog
                        handleOpenFileExplorer(); // Trigger file explorer
                    }} color="primary">
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

            {/* Hidden file input */}
            <Input
                type="file"
                inputProps={{ accept: ".csv" }}
                id="csv-upload"
                sx={{ display: "none" }}
                onChange={handleFileChange}
            />

            <Copyright />
        </Box>
    );
};

export default UploadDepartments;
