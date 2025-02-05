import React from "react";
import { Box, Container, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReplayIcon from "@mui/icons-material/Replay";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar";
import Line from "../../components/Line/Line";
import LibraryCard from "../../components/LibraryCard/LibraryCard";

const BorrowingHistory: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSideBarClick = () => setSidebarOpen(!isSidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleViewHistoryClick = () => {
    navigate('/transaction/history');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container>
        {/* Header */}
        <Header
          buttons={
            <IconButton onClick={handleSideBarClick}>
              <MenuIcon sx={{ color: '#ea4040' }} />
            </IconButton>
          }
        />
        <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />

        {/* Page Content */}
        <Box sx={{ flex: 1, mt: 4 }}>
          <Container maxWidth="lg" sx={{ mb: 4 }}>
            {/* Left-Aligned Title */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              User Dashboard
            </Typography>
            <Line />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mt: 4 }}>
              {/* User Details */}
              <Box
                sx={{
                  flex: '1 1 35%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <LibraryCard />
              </Box>

              {/* Reminder Panel and Borrowing Stats */}
              <Box sx={{ flex: '1 1 60%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#ffebcc',
                    borderLeft: '6px solid #ff9800',
                    padding: '1rem',
                    borderRadius: '8px',
                    mb: 3
                  }}
                >
                  <WarningAmberIcon sx={{ color: '#ff9800', fontSize: '2rem', mr: 2 }} />
                  <Typography variant="h6" sx={{ color: '#333' }}>
                    Reminder: You have a book due soon. Please return or renew it to avoid overdue fines.
                  </Typography>
                </Box>

                {/* Borrowing Stats */}
                <Box
                  sx={{
                    background: '#fff',
                    padding: '2rem',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    mt: 3
                  }}
                >
                  <Typography variant="h6">
                    Borrowed Books: <span style={{ color: '#ea4040', fontWeight: 'bold', fontSize: '1.75rem' }}>3</span>
                  </Typography>
                  <Typography variant="h6">
                    Current Borrowed Books: <span style={{ color: '#ea4040', fontWeight: 'bold', fontSize: '1.75rem' }}>1</span>
                  </Typography>
                  <Typography variant="h6">
                    Overdue fines: <span style={{ color: '#ea4040', fontWeight: 'bold', fontSize: '1.75rem' }}>₱0.00</span>
                  </Typography>

                  {/* Action Buttons */}
                  <Box sx={{ mt: 5, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {/* Borrow a Book */}
                    <Button
                      sx={{
                        backgroundColor: '#ea4040',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        p: 2,
                        textTransform: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        '&:hover': { backgroundColor: '#873232' },
                        width: { xs: '100%', sm: '48%', md: '30%' }, // responsive width
                      }}
                      startIcon={<LibraryBooksIcon />}
                    >
                      Borrow a Book
                    </Button>
                    {/* Renew a Book */}
                    <Button
                      sx={{
                        backgroundColor: '#ea4040',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        p: 2,
                        textTransform: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        '&:hover': { backgroundColor: '#873232' },
                        width: { xs: '100%', sm: '48%', md: '30%' }, // responsive width
                      }}
                      startIcon={<ReplayIcon />}
                    >
                      Renew a Book
                    </Button>
                    {/* Return a Book */}
                    <Button
                      sx={{
                        backgroundColor: '#ea4040',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        p: 2,
                        textTransform: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        '&:hover': { backgroundColor: '#873232' },
                        width: { xs: '100%', sm: '48%', md: '30%' }, // responsive width
                      }}
                      startIcon={<AssignmentReturnIcon />}
                    >
                      Return a Book
                    </Button>
                    {/* View History */}
                    <Button
                      sx={{
                        backgroundColor: '#ea4040',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        p: 2,
                        textTransform: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        '&:hover': { backgroundColor: '#873232' },
                        width: { xs: '100%', sm: '48%', md: '30%' }, // responsive width
                      }}
                      startIcon={<HistoryIcon />}
                      onClick={handleViewHistoryClick}
                    >
                      View History
                    </Button>
                    {/* Reserve a Book */}
                    <Button
                      sx={{
                        backgroundColor: '#ea4040',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        p: 2,
                        textTransform: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        '&:hover': { backgroundColor: '#873232' },
                        width: { xs: '100%', sm: '48%', md: '30%' }, // responsive width
                      }}
                      startIcon={<BookmarkIcon />}
                    >
                      Reserve a Book
                    </Button>
                  </Box>

                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default BorrowingHistory;
