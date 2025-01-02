import React, { useEffect, useState } from 'react';

interface Overdue {
    loanId: string;
    borrower: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string;
    penalty: string;
    status: string;
}
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from '../../components/Header/Header';
import Line from "../../components/Line/Line";
import styles from "./styles.module.css";
import Copyright from '../../components/Footer/Copyright';
import { getOverdueLoans } from '../../services/CirculationApi';

const OverseeOverdue: React.FC = () => {

    const [overdue, setOverdue] = useState<Overdue[]>([]);

    const handleSideBarClick = () => {
        console.log("Hamburger menu clicked!");
    };

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const overdueData = await getOverdueLoans();
                setOverdue(overdueData);
            } catch (error) {
                console.error("Error fetching overdue:", error);
            }
        };
        fetchLoans();
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
                            {overdue.map((due, index) => (
                                <TableRow key={index}>
                                    <TableCell>{due.loanId}</TableCell>
                                    <TableCell>{due.borrowDate}</TableCell>
                                    <TableCell>{due.dueDate}</TableCell>
                                    <TableCell>{due.returnDate}</TableCell>
                                    <TableCell>{due.penalty}</TableCell>
                                    <TableCell>{due.status}</TableCell>

                                    <TableCell>
                                        <Button
                                            variant="text"
                                            sx={{
                                                color: "#EA4040",
                                                textTransform: "none",
                                                ":hover": {
                                                    backgroundColor: "#f2f2f2",
                                                    color: "#d13333",
                                                },
                                            }}
                                        // onClick={handleOpenModal}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>



            <Copyright />
        </Box>
    );
};


export default OverseeOverdue;


