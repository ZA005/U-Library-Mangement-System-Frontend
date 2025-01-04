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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import styles from "./styles.module.css";
import Copyright from "../../components/Footer/Copyright";
import { calculateFines, getAllFines } from "../../services/CirculationApi";

interface Fine {
    fineId: number;
    loanId: number;
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

    const handleSideBarClick = () => {
        console.log("Hamburger menu clicked!");
    };

    // Fetch fines when the component mounts
    useEffect(() => {
        const fetchFines = async () => {
            try {
                await calculateFines();
                const result = await getAllFines(); // Assuming the backend returns an array of fines
                setFines(result);
            } catch (error) {
                console.error("Error calculating fines:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFines();
    }, []);

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
                ) : (
                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Loan #</TableCell>
                                    <TableCell>Date Borrowed</TableCell>
                                    <TableCell>Due Date</TableCell>
                                    <TableCell>Date Returned</TableCell>
                                    <TableCell>Penalty</TableCell>
                                    <TableCell>Penalty Status</TableCell>
                                    <TableCell>ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fines.map((fine, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{fine.loanId}</TableCell>
                                        <TableCell>{new Date(fine.borrowDate).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(fine.dueDate).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(fine.returnDate).toLocaleString()}</TableCell>
                                        <TableCell>{fine.fineAmount + " php"}</TableCell>
                                        <TableCell>{fine.paid ? "Paid" : "Unpaid"}</TableCell>
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
                                                Edit
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            <Copyright />
        </Box>
    );
};

export default OverseeOverdue;
