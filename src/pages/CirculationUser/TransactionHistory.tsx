import React from "react";
import { Box, Container, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar";
import Line from "../../components/Line/Line";
import styles from "./styles.module.css";

// Sample data for the transaction history with Book Title and Author
const transactions = [
  { id: "TRX001", date: "2025-01-15", amount: 100.0, status: "Paid", bookTitle: "The Great Gatsby", bookAuthor: "F. Scott Fitzgerald" },
  { id: "TRX002", date: "2025-01-10", amount: 50.0, status: "Paid", bookTitle: "1984", bookAuthor: "George Orwell" },
  { id: "TRX003", date: "2025-01-05", amount: 150.0, status: "Pending", bookTitle: "To Kill a Mockingbird", bookAuthor: "Harper Lee" },
];

const PayFee: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const handleSideBarClick = () => setSidebarOpen(!isSidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" className={styles.container}>

      <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
      {/* Page Content */}
      <Box flex="1">
        <Container maxWidth="lg" className={styles.content}>
          {/* Header */}
          <Header
            buttons={
              <IconButton onClick={handleSideBarClick}>
                <MenuIcon className={styles.menuIcon} />
              </IconButton>
            }
          />
          {/* Left-Aligned Title */}
          <Box className={styles.headerTitleContainer}>
            <Typography variant="h3" fontWeight="bold" className={styles.title}>
              Transaction History
            </Typography>
            <Line />
          </Box>

          {/* Transaction Table */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="transaction history table">
              <TableHead>
                <TableRow>
                  {/* <TableCell>Transaction ID</TableCell> */}
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Book Title</TableCell>
                  <TableCell align="left">Book Author</TableCell>
                  <TableCell align="left">Amount (₱)</TableCell>
                  <TableCell align="left">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    {/* <TableCell component="th" scope="row">
                      {transaction.id}
                    </TableCell> */}
                    <TableCell align="left">{transaction.date}</TableCell>
                    <TableCell align="left">{transaction.bookTitle}</TableCell>
                    <TableCell align="left">{transaction.bookAuthor}</TableCell>
                    <TableCell align="left">{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell align="left">{transaction.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ marginTop: 3 }}>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default PayFee;
