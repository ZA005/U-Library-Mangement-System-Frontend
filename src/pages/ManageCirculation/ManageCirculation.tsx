import React, { useEffect, useState } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import Copyright from "../../components/Footer/Copyright";
import CirculationIssueBookModal from "../../components/Circulation/CirculationPopUps/CirculationIssueBookModal";
import CirculationUpdateModal from "../../components/Circulation/CirculationPopUps/CirculationUpdateModal";
import styles from "./styles.module.css";
import { getLoanById, getBorrowedLoans } from "../../services/Circulation/CirculationApi";
import { Loan } from "../../model/Loan";

const ManageCirculation: React.FC = () => {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [barcode, setBarcode] = useState<string>("");
  const [loanData, setLoanData] = useState<Loan[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      try {
        const loansData = await getBorrowedLoans();
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

  const handleSideBarClick = () => console.log("Hamburger menu clicked!");

  const handleOpenModal = async (loanId: bigint) => {
    try {
      const data = await getLoanById(loanId);
      setLoanData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  };

  const handleCloseModal = () => {
    setIsIssueModalOpen(false);
    setIsModalOpen(false);
    setLoanData(null); // Reset loan data on close
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setBarcode(searchTerm);

    if (searchTerm.trim() === "") {
      setFilteredLoans(loans);
    } else {
      const filtered = loans.filter(
        (loan) =>
          loan.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.borrower.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLoans(filtered);
    }
  };

  const handleUpdateLoan = (updatedLoan: Loan) => {
    setIsModalOpen(false);

    // Update the loan in the state
    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.loanId === updatedLoan.loanId ? updatedLoan : loan
      )
    );
    setFilteredLoans((prevFilteredLoans) =>
      prevFilteredLoans.map((loan) =>
        loan.loanId === updatedLoan.loanId ? updatedLoan : loan
      )
    );
    setLoanData(null); // Reset loan data after updating
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
          Manage Borrowed Book
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
            onClick={() => setIsIssueModalOpen(true)}
          >
            New Borrow
          </Button>

          <Box className={styles.searchBox}>
            <TextField
              value={barcode}
              onChange={handleBarcodeChange}
              placeholder="Search by Barcode..."
              size="small"
              InputProps={{
                startAdornment: <SearchIcon className={styles.searchIcon} />,
              }}
            />
          </Box>
        </Box>

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
                  <TableCell>Borrowed Timestamp</TableCell>
                  {/* <TableCell>Date & Time Returned</TableCell> */}
                  <TableCell>Due Date</TableCell>
                  {/* <TableCell>Status</TableCell> */}
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLoans.map((loan) => (
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
                    {/* <TableCell>
                      {loan.returnDate
                        ? new Date(loan.returnDate).toLocaleString("en-US", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })
                        : ""}
                    </TableCell> */}
                    <TableCell>
                      {loan.dueDate
                        ? new Date(loan.dueDate).toLocaleString("en-US", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })
                        : "N/A"}
                    </TableCell>
                    {/* <TableCell
                      className={
                        loan.status === "Active"
                          ? styles.activeStatus
                          : styles.inactiveStatus
                      }
                    >
                      {loan.status}
                    </TableCell> */}
                    <TableCell>
                      <Select
                        value={() => { }}
                        onChange={() => { }}
                        displayEmpty
                        className={styles.select}
                        disabled={isLoading}
                      >
                        <MenuItem value="" disabled>
                          Action
                        </MenuItem>
                        <MenuItem value="Return">Return</MenuItem>
                        <MenuItem value="Renew">Renew</MenuItem>

                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <CirculationIssueBookModal
        open={isIssueModalOpen}
        handleClose={handleCloseModal}
      />


      {isModalOpen && loanData && (
        <CirculationUpdateModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          loanData={loanData}
          onUpdateLoan={handleUpdateLoan} // Pass callback to update loan
        />
      )}
      <Copyright />
    </Box>
  );
};

export default ManageCirculation;
