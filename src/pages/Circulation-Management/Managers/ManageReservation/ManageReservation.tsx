import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, IconButton, Pagination, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Header from '../../../../components/Header/Header';
import Line from "../../../../components/Line/Line";
import styles from "./styles.module.css";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Copyright from '../../../../components/Footer/Copyright';
import { getAllReservations } from '../../../../services/Circulation/CirculationApi';
import Sidebar from '../../../../components/Sidebar';
import { Reservations } from '../../../../model/Loan';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import ReserveBookModal from '../../../../components/Circulation/CirculationPopUps/ReserveBookModal';

const ManageReservation: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [reserves, setReserves] = useState<Reservations[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredReservations, setFilteredReservations] = useState<Reservations[]>([]);
    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 5;
    const [isReserveBookModalOpen, setIsReserveBookModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSideBarClick = () => { setSidebarOpen(!isSidebarOpen); };
    const handleSidebarClose = () => { setSidebarOpen(false); };
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    const handleCloseModal = () => {
        setIsReserveBookModalOpen(false);
        setIsModalOpen(false);
        setReserves(null);
    }
    const handleReserveSuccess = async (updatedReserve: Reservations) => {
        const reserve = updatedReserve;

        setReserves(prevReserve => [
            ...(prevReserve || []).filter(reserveItem => reserveItem.reservationId !== reserve.reservationId),
            reserve
        ]);

        setFilteredReservations(prevFilteredReserves => [
            ...prevFilteredReserves.filter(reserveItem => reserveItem.reservationId !== reserve.reservationId),
            reserve
        ]);

        await fetchReservations();

        setIsReserveBookModalOpen(false);
    }

    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();



    const paginatedReservations = (filteredReservations || []).slice((page - 1) * itemsPerPage, page * itemsPerPage);

    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoading(true);
            try {
                const reservesData = await getAllReservations();
                setReserves(reservesData);
                setFilteredReservations(reservesData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setIsLoading(true);
        try {
            const reservesData = await getAllReservations();
            setReserves(reservesData);
            setFilteredReservations(reservesData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <Box className={styles.rootContainer}>
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
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
                    Manage Reservation
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
                        onClick={() => setIsReserveBookModalOpen(true)}
                    >
                        Reserve a book
                    </Button>
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

                {isLoading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Accession #</TableCell>
                                    <TableCell>Book Title</TableCell>
                                    <TableCell>Author</TableCell>
                                    <TableCell>Borrower</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Date & Time Reserved</TableCell>
                                    <TableCell>Expiration</TableCell>
                                    <TableCell>Due</TableCell>
                                    <TableCell>STATUS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(filteredReservations?.length || 0) === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            <Typography variant="h6" align="center" mt={5}>No record to display</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedReservations.map((reserves) => (
                                        <TableRow key={reserves.reservationId}>
                                            <TableCell>{reserves.accessionNo}</TableCell>
                                            <TableCell>{reserves.title}</TableCell>
                                            <TableCell>{reserves.author}</TableCell>
                                            <TableCell>{reserves.uncIdNumber}</TableCell>
                                            <TableCell>{reserves.department}</TableCell>
                                            <TableCell>
                                                {reserves.reservationDate
                                                    ? new Date(reserves.reservationDate).toLocaleString("en-US", {
                                                        dateStyle: "short",
                                                        timeStyle: "medium",
                                                    })
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {reserves.expirationDate
                                                    ? new Date(reserves.expirationDate).toLocaleString("en-US", {
                                                        dateStyle: "short",
                                                        timeStyle: "medium",
                                                    })
                                                    : ""}
                                            </TableCell>
                                            <TableCell>
                                                {reserves.expirationDate
                                                    ? new Date(reserves.expirationDate).toLocaleString("en-US", {
                                                        dateStyle: "short",
                                                        timeStyle: "medium",
                                                    })
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell
                                                className={
                                                    reserves.reservationStatus === "PENDING"
                                                        ? styles.activeStatus
                                                        : styles.inactiveStatus
                                                }
                                            >
                                                {reserves.reservationStatus}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        {filteredReservations?.length > 0 && (
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Pagination
                                    count={Math.ceil(filteredReservations.length / itemsPerPage)}
                                    page={page}
                                    onChange={handlePageChange}
                                />
                            </Box>
                        )}
                    </TableContainer>
                )}
            </Container>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                <Alert onClose={closeSnackbar} severity={snackbarStatus}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <ReserveBookModal
                open={isReserveBookModalOpen}
                handleClose={handleCloseModal}
                onReserveSuccess={handleReserveSuccess}
            />
            <Copyright />
        </Box>
    );
};

export default ManageReservation;
