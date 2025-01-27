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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import Copyright from "../../components/Footer/Copyright";
import CirculationIssueBookModal from "../../components/Circulation/CirculationPopUps/CirculationIssueBookModal";
import styles from "./styles.module.css";
import { getBorrowedLoans, updateLoanStatus } from "../../services/Circulation/CirculationApi";
import { Loan } from "../../model/Loan";

const ManageCirculation: React.FC = () => {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [barcode, setBarcode] = useState<string>("");
  const [loanData, setLoanData] = useState<Loan[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [action, setAction] = useState<"Return" | "Renew" | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleAction = (loan: Loan, selectedAction: "Return" | "Renew") => {
    setSelectedLoan(loan);
    setAction(selectedAction);
    setIsDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (selectedLoan && action) {
      const updatedLoan = {
        ...selectedLoan,
        status: action === "Return" ? "Returned" : "Borrowed",
        returnDate: action === "Return" ? new Date().toISOString() : selectedLoan.returnDate,
      };

      console.log("Updated Loan:", updatedLoan);  // Check if action is correct here
      try {
        const status = updatedLoan.status === "Borrowed" ? "Renewed" : "Returned";
        console.log("Sending Status:", updatedLoan.status, "Action:", status);
        await updateLoanStatus(BigInt(updatedLoan.loanId), updatedLoan.status, status);

        console.log(status)
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
      } catch (error) {
        console.error("Error updating loan:", error);
      } finally {
        setIsDialogOpen(false);
        setSelectedLoan(null);
        setAction(null);
      }
    }
  };

  const handleCancelAction = () => {
    setIsDialogOpen(false);
    setSelectedLoan(null);
    setAction(null);
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
          Manage Circulation
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
                        displayEmpty
                        value=""
                        onChange={(e) =>
                          handleAction(loan, e.target.value as "Return" | "Renew")
                        }
                        className={styles.select}
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


      <Dialog open={isDialogOpen} onClose={handleCancelAction}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {action?.toLowerCase()} this loan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction}>Cancel</Button>
          <Button onClick={handleConfirmAction} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Copyright />
    </Box>
  );
};

export default ManageCirculation;
