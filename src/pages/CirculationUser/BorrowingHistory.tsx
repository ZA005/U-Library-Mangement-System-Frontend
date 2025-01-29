// src/pages/BorrowingHistory/BorrowingHistory.tsx
import React from "react";
import { Box, Container, IconButton, Typography, Grid, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar";
import Line from "../../components/Line/Line"; // Import the Line component
import styles from "./styles.module.css";

const BorrowingHistory: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const handleSideBarClick = () => setSidebarOpen(!isSidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" className={styles.container}>
      {/* Header */}
      <Header
        buttons={
          <IconButton onClick={handleSideBarClick}>
            <MenuIcon className={styles.menuIcon} />
          </IconButton>
        }
      />
      {/* Sidebar */}
      <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
      {/* Main Content */}
      <Box flex="1">
        <Container maxWidth="lg" className={styles.content}>
          {/* Title */}
          <Typography 
            variant="h3" 
            gutterBottom 
            fontWeight="bold" 
            align="left" 
            className={styles.title}
          >
            Borrowing History
          </Typography>

          {/* Horizontal Line */}
          <Line
            style={{
              borderBottom: "1px solid #ea4040",
              width: "20%",
              margin: "1rem auto",
            }}
            className={styles.separator}
          />

          {/* Content Grid */}
          <Grid container spacing={3} className={styles.historyContainer}>
            {/* User Details */}
            <Grid item xs={12} md={6} className={styles.userDetails}>
              {/* Temporary QR Code Image */}
              <img
                src="https://via.placeholder.com/100?text=QR"
                alt="QR Code"
                style={{ display: "block", margin: "0 auto 1.5rem auto" }}
              />

              <Typography variant="h6" className={styles.userId}>
                85462698423684
              </Typography>
              <Typography>Student/Faculty</Typography>
              <Typography>Name:</Typography>
              <Typography>ID Number:</Typography>
              <Typography>Grade/Year Level:</Typography>
              <Typography>Department:</Typography>
              <Typography>Course:</Typography>
            </Grid>

            {/* Borrowing Stats and Actions */}
            <Grid item xs={12} md={6} className={styles.stats}>
              {/* Borrowing Statistics */}
              <Typography>
                Borrowed Books: <span className={styles.highlight}>0</span>
              </Typography>
              <Typography>
                Current Borrowed Books: <span className={styles.highlight}>0</span>
              </Typography>
              <Typography>
                Overdue fines: <span className={styles.highlight}>0</span>
              </Typography>

              {/* Add spacing between text and buttons */}
              <Box sx={{ marginTop: 12 }}>
                <Grid container spacing={2} className={styles.buttonContainer}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button fullWidth className={styles.actionButton}>
                      Borrow a Book
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button fullWidth className={styles.actionButton}>
                      Pay Fees
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button fullWidth className={styles.actionButton}>
                      Renew a Book
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button fullWidth className={styles.actionButton}>
                      View History
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button fullWidth className={styles.actionButton}>
                      Return a Book
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default BorrowingHistory;
