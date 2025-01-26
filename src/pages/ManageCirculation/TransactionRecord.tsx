import React, { useEffect, useState } from "react";
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
    Pagination,
    IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import Copyright from "../../components/Footer/Copyright";
import { getAllLoans } from "../../services/Circulation/CirculationApi";
import { Loan } from "../../model/Loan";
import styles from "./styles.module.css";

const TransactionRecord: React.FC = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchLoans = async () => {
            setIsLoading(true);
            try {
                const loansData = await getAllLoans();
                setLoans(loansData);
                setFilteredLoans(loansData);
            } catch (error) {
                console.error("Error fetching loans:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLoans();
    }, []);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const paginatedLoans = filteredLoans.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box className={styles.rootContainer}>
            <Container maxWidth="lg" className={styles.container}>
                <Header
                    buttons={
                        <IconButton>
                            <MenuIcon className={styles.menuIcon} />
                        </IconButton>
                    }
                />
                <Typography variant="h4" gutterBottom className={styles.title}>
                    Transaction Record
                </Typography>

                <Line />

                {isLoading ? (
                    <Typography>Loading...</Typography>
                ) : filteredLoans.length === 0 ? (
                    <Typography>No loans to display</Typography>
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
                                    <TableCell>Date & Time Borrowed</TableCell>
                                    <TableCell>Date & Time Returned</TableCell>
                                    <TableCell>Due</TableCell>
                                    <TableCell>STATUS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedLoans.map((loan) => (
                                    <TableRow key={loan.loanId}>
                                        <TableCell>{loan.accessionNo}</TableCell>
                                        <TableCell>{loan.title}</TableCell>
                                        <TableCell>{loan.authorName}</TableCell>
                                        <TableCell>{loan.borrower}</TableCell>
                                        <TableCell>{loan.departmentName}</TableCell>
                                        <TableCell>
                                            {loan.borrowDate
                                                ? new Date(loan.borrowDate).toLocaleString("en-US", {
                                                    dateStyle: "short",
                                                    timeStyle: "medium",
                                                })
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {loan.returnDate
                                                ? new Date(loan.returnDate).toLocaleString("en-US", {
                                                    dateStyle: "short",
                                                    timeStyle: "medium",
                                                })
                                                : ""}
                                        </TableCell>
                                        <TableCell>
                                            {loan.dueDate
                                                ? new Date(loan.dueDate).toLocaleString("en-US", {
                                                    dateStyle: "short",
                                                    timeStyle: "medium",
                                                })
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell
                                            className={
                                                loan.status === "Active"
                                                    ? styles.activeStatus
                                                    : styles.inactiveStatus
                                            }
                                        >
                                            {loan.status}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={Math.ceil(filteredLoans.length / itemsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                    />
                </Box>
            </Container>

            <Copyright />
        </Box>
    );
};

export default TransactionRecord;
