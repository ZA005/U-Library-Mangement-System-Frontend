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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import styles from "./styles.module.css";
import Copyright from "../../components/Footer/Copyright";
import { calculateFines, getAllFines, getAllFineDetails } from "../../services/Circulation/CirculationApi";

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
    paid: boolean;
}

const OverseeOverdue: React.FC = () => {
    const [fines, setFines] = useState<Fine[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchFines = async () => {
            try {
                await calculateFines();
                const result = await getAllFineDetails(); // Assuming the backend returns an array of fines
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
                                    {/* <TableCell><strong>Penalty Status</strong></TableCell> */}
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
                                        {/* <TableCell>{new Date(fine.returnDate).toLocaleString()}</TableCell> */}
                                        <TableCell>{fine.fineAmount} php</TableCell>
                                        {/* <TableCell>{fine.paid ? "Paid" : "Unpaid"}</TableCell> */}
                                        {/* <TableCell>{fine.user.name}</TableCell> */}
                                        <TableCell>
                                            <Typography
                                                variant="button"
                                                sx={{
                                                    color: "#EA4040",
                                                    textTransform: "none",
                                                    cursor: "pointer",
                                                    ":hover": {
                                                        color: "#d13333",
                                                    },
                                                }}
                                            >
                                                Paid
                                            </Typography>
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
        </Box>
    );
};

export default OverseeOverdue;
