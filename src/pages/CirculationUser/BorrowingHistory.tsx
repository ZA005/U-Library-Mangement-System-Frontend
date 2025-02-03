import React from "react";
import { Box, Container, IconButton, Typography, Grid, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReplayIcon from "@mui/icons-material/Replay";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar";
import Line from "../../components/Line/Line";
import LibraryCard from "../../components/LibraryCard/LibraryCard";
import styles from "./styles.module.css";

const BorrowingHistory: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate(); // Use the navigate hook

  const handleSideBarClick = () => setSidebarOpen(!isSidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleViewHistoryClick = () => {
    navigate('/transaction/history'); // Redirect to TransactionHistory page
  };

  const handlePayFeesClick = () => {
    navigate('/pay/fees'); // Redirect to PayFees page
  };

  return (
    <Box className={styles.rootContainer}>
      <Container>
        {/* Header */}
        <Header
          buttons={
            <IconButton onClick={handleSideBarClick}>
              <MenuIcon className={styles.menuIcon} />
            </IconButton>
          }
        />
        <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />

        {/* Page Content */}
        <Box flex="1">
          <Container maxWidth="lg" className={styles.content}>
            {/* Left-Aligned Title */}
            <Typography variant="h4" gutterBottom className={styles.title}>
              User Dashboard
            </Typography>
            <Line />

            <Grid container spacing={6} className={styles.historyContainer}>
              {/* User Details */}
              <Grid item xs={12} md={5} className={styles.userDetailsBox}>
                <Box display="flex" justifyContent="center" alignItems="center" marginBottom="1rem">
                  <LibraryCard />
                </Box>
              </Grid>

              {/* Reminder Panel */}
              <Grid item xs={12} md={7}>
                <Box className={styles.reminderBox}>
                  <WarningAmberIcon className={styles.reminderIcon} />
                  <Typography variant="h6" className={styles.reminderText}>
                    Reminder: You have a book due soon. Please return or renew it to avoid overdue fines.
                  </Typography>
                </Box>

                {/* Borrowing Stats and Actions */}
                <Box className={styles.stats}>
                  <Typography variant="h6">
                    Borrowed Books: <span className={styles.highlight}>3</span>
                  </Typography>
                  <Typography variant="h6">
                    Current Borrowed Books: <span className={styles.highlight}>1</span>
                  </Typography>
                  <Typography variant="h6">
                    Overdue fines: <span className={styles.highlight}>₱0.00</span>
                  </Typography>

                  {/* Action Buttons */}
                  <Box sx={{ marginTop: 5 }}>
                    <Grid container spacing={3} className={styles.buttonContainer}>
                      {/* Borrow a Book */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Button fullWidth className={styles.actionButton} startIcon={<LibraryBooksIcon />}>
                          Borrow a Book
                        </Button>
                      </Grid>
                      {/* Renew a Book */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Button fullWidth className={styles.actionButton} startIcon={<ReplayIcon />}>
                          Renew a Book
                        </Button>
                      </Grid>
                      {/* Return a Book */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Button fullWidth className={styles.actionButton} startIcon={<AssignmentReturnIcon />}>
                          Return a Book
                        </Button>
                      </Grid>
                      {/* View History */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Button
                          fullWidth
                          className={styles.actionButton}
                          startIcon={<HistoryIcon />}
                          onClick={handleViewHistoryClick} // Handle View History click
                        >
                          View History
                        </Button>
                      </Grid>
                      {/* Pay Fees */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Button fullWidth className={styles.actionButton} startIcon={<MonetizationOnIcon />} onClick={handlePayFeesClick}>
                          Pay Fees
                        </Button>
                      </Grid>
                      {/* Reserve a Book */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Button fullWidth className={styles.actionButton} startIcon={<BookmarkIcon />}>
                          Reserve a Book
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>


      </Container>
      <Footer />
    </Box>
  );
};

export default BorrowingHistory;
