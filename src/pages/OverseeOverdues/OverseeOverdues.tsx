import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    IconButton,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Snackbar,
    Alert
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import styles from "./styles.module.css";
import Copyright from "../../components/Footer/Copyright";
import { calculateFines, getAllFineDetails, updateFinePaidStatus } from "../../services/Circulation/CirculationApi";
import { useSnackbar } from "../../hooks/useSnackbar";

interface Fine {
    fineId: number;
    loanId: number;
    stakeholder_id: string;
    first_name: string;
    last_name: string;
    borrowDate: string;
    dueDate: string;
    fineAmount: number;
    returnDate: string;
    user: { userId: number; name: string };
    paid: number;
}

const OverseeOverdue: React.FC = () => {
    const [fines, setFines] = useState<Fine[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 6;

    // State for confirmation dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFineId, setSelectedFineId] = useState<number | null>(null);
    const { snackbarOpen, snackbarMessage, snackbarStatus, openSnackbar, closeSnackbar } = useSnackbar();
    useEffect(() => {
        const fetchFines = async () => {
            try {
                await calculateFines();
                const result = await getAllFineDetails();
                setFines(result);
            } catch (error) {
                console.error("Error calculating fines:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFines();
    }, []);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSideBarClick = () => {
        console.log("Hamburger menu clicked!");
    };

    // Open confirmation dialog
    const handleOpenDialog = (fineId: number) => {
        setSelectedFineId(fineId);
        setOpenDialog(true);
    };

    // Close dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFineId(null);
    };

    // Mark fine as paid after confirmation
    const handleConfirmPaid = async () => {
        if (selectedFineId === null) return;

        try {
            await updateFinePaidStatus(selectedFineId);
            const updatedFines = await getAllFineDetails(); // Refresh fines
            setFines(updatedFines);

            // Show success message
            openSnackbar("Fine marked as paid successfully!", "success");
        } catch (error) {
            console.error("Error updating fine status:", error);
            openSnackbar("Failed to update fine status", "error");
        } finally {
            handleCloseDialog(); // Close the dialog
        }
    };

    return (
        <Box className={styles.rootContainer}>
            <Container maxWidth="lg" className={styles.container}>
                <Header
                    buttons={
                        <>
                            <IconButton onClick={handleSideBarClick}>
                                <MenuIcon className={styles.menuIcon} />
                            </IconButton>
                        </>
                    }
                />
                <Typography variant="h4" gutterBottom className={styles.title}>
                    Oversee Overdue
                </Typography>

                <Line />

                <Box className={styles.actionBar}>
                    <Box></Box>
                    <Box className={styles.searchBox}>
                        <TextField
                            placeholder="Search..."
                            size="small"
                            InputProps={{
                                startAdornment: <SearchIcon className={styles.searchIcon} />,
                            }}
                        />
                    </Box>
                </Box>

                {loading ? (
                    <Typography variant="h6" align="center">
                        Calculating fines...
                    </Typography>
                ) : fines.length === 0 ? (
                    <Typography variant="body1" align="center">
                        No fines to display.
                    </Typography>
                ) : (
                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Date Borrowed</strong></TableCell>
                                    <TableCell><strong>Due Date</strong></TableCell>
                                    <TableCell><strong>Penalty</strong></TableCell>
                                    <TableCell><strong>Action</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fines.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((fine, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{fine.stakeholder_id}</TableCell>
                                        <TableCell>{`${fine.first_name} ${fine.last_name}`}</TableCell>
                                        <TableCell>{new Date(fine.borrowDate).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(fine.dueDate).toLocaleString()}</TableCell>
                                        <TableCell>{fine.fineAmount} php</TableCell>
                                        <TableCell>
                                            {fine.paid === 0 ? (
                                                <Typography
                                                    variant="button"
                                                    sx={{
                                                        color: "#EA4040",
                                                        textTransform: "none",
                                                        cursor: "pointer",
                                                        ":hover": { color: "#d13333" },
                                                    }}
                                                    onClick={() => handleOpenDialog(fine.fineId)}
                                                >
                                                    Mark as Paid
                                                </Typography>
                                            ) : (
                                                <Typography variant="button" sx={{ color: "#28a745" }}>
                                                    Paid
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={Math.ceil(fines.length / itemsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                    />
                </Box>
            </Container>

            <Copyright />

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Payment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to mark this fine as paid? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}
                        variant="outlined"
                        sx={{ color: "#EA4040", borderColor: "#EA4040" }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmPaid}
                        variant="contained"
                        autoFocus
                        sx={{ backgroundColor: "#EA4040" }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <Alert onClose={closeSnackbar} severity={snackbarStatus} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OverseeOverdue;
