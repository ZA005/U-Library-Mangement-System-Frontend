/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Alert,
  Snackbar,
  Pagination
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../../components/Header/Header";
import Line from "../../../../components/Line/Line";
import Copyright from "../../../../components/Footer/Copyright";
import CirculationIssueBookModal from "../../../../components/Circulation/CirculationPopUps/CirculationIssueBookModal";
import styles from "./styles.module.css";
import { getBorrowedLoans, updateLoanStatus } from "../../../../services/Circulation/CirculationApi";
import { Loan } from "../../../../model/Loan";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import Sidebar from "../../../../components/Sidebar";

const ManageCirculation: React.FC = () => {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [loanData, setLoanData] = useState<Loan[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [action, setAction] = useState<"Return" | "Renew" | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accessionNo, setAccessionNo] = useState<string>("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 5;

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
  }

  const handleLoanSuccess = async (updatedLoan: unknown) => {
    const loan = updatedLoan as Loan;

    // Update the loans and filteredLoans state with the new data
    setLoans(prevLoans => [
      ...prevLoans.filter(loanItem => loanItem.id !== loan.id),
      loan
    ]);

    setFilteredLoans(prevFilteredLoans => [
      ...prevFilteredLoans.filter(loanItem => loanItem.id !== loan.id),
      loan
    ]);

    // Fetch updated loans to reflect any changes or new loans from server
    await fetchLoans();

    // Close the modal after updating the loan data
    setIsIssueModalOpen(false);
  };

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarStatus,
    openSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const handleSideBarClick = () => {
    if (!isLoading) setSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    if (!isLoading) setSidebarOpen(false);
  };


  const handleCloseModal = () => {
    setIsIssueModalOpen(false);
    setIsModalOpen(false);
    setLoanData(null);
  };

  const handleAccessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setAccessionNo(searchTerm);

    if (searchTerm.trim() === "") {
      setFilteredLoans(loans);
    } else {
      const filtered = loans.filter(
        (loan) =>
          loan.accessionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.uncIdNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
        returnDate: action === "Return" ? new Date() : selectedLoan.dateReturned,
      };
      try {
        const status = updatedLoan.status === "Borrowed" ? "Renewed" : "Returned";
        openSnackbar(`Successfully ${status} ${selectedLoan.title}.`, "success");
        await updateLoanStatus(BigInt(updatedLoan.id), updatedLoan.status, status);

        // Update the local state directly after the API call succeeds
        handleLoanSuccess(updatedLoan);
      } catch (error) {
        console.error("Error updating loan:", error);
      } finally {
        setIsDialogOpen(false);
        setSelectedLoan(null);
        setAction(null);
      }
      await fetchLoans();
    }
  };
  const handleCancelAction = () => {
    setIsDialogOpen(false);
    setSelectedLoan(null);
    setAction(null);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedLoans = filteredLoans.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
              value={accessionNo}
              onChange={handleAccessionChange}
              placeholder="Search by Accession number..."
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
                {paginatedLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{loan.accessionNo}</TableCell>
                    <TableCell>{loan.title}</TableCell>
                    <TableCell>{loan.author}</TableCell>
                    <TableCell>{loan.uncIdNumber}</TableCell>
                    <TableCell>{loan.department}</TableCell>
                    <TableCell>
                      {loan.dateBorrowed
                        ? new Date(loan.dateBorrowed).toLocaleString("en-US", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {loan.dueDate
                        ? new Date(loan.dueDate).toLocaleString("en-US", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })
                        : "N/A"}
                    </TableCell>
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
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(filteredLoans.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      </Container>

      <CirculationIssueBookModal
        open={isIssueModalOpen}
        handleClose={handleCloseModal}
        onLoanSuccess={handleLoanSuccess}
      />

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
        <Alert onClose={closeSnackbar} severity={snackbarStatus}>
          {snackbarMessage}
        </Alert>
      </Snackbar>


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
