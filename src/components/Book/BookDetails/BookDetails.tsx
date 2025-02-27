/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../../services/UserManagement/UserService';
import { Book } from '../../../model/Book';
import { useState } from 'react';
import BookList from '../BookList/BookListComponent';
import Header from '../../Header/Header';
import Footer from '../../Footer/Copyright';
import { Box, Button, Typography, CardMedia, Collapse, Container, IconButton, Alert, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { getBooksByAuthor } from '../../../services/Cataloging/LocalBooksAPI';
import './BookDetails.css';
import Sidebar from '../../Sidebar';
import MenuIcon from "@mui/icons-material/Menu";
import { fetchBookDetails, fetchBorrowerDetails, getBooksByISBN, saveLoanDetails } from '../../../services/Circulation/CirculationApi';
import { useSnackbar } from '../../../hooks/useSnackbar';



const BookDetails: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showBooks, setShowBooks] = useState(false);
  const [booksByAuthor, setBooksByAuthor] = useState<Book[] | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [borrowDetails, setBorrowDetails] = useState<any>(null);

  const book: Book = state?.book;
  const source = state?.source;
  const acquiredBook = state?.acquiredBook;

  const handleToggleBooksByAuthor = async () => {
    setShowBooks((prev) => !prev);
    if (!showBooks && booksByAuthor === null) {
      try {
        const books = await getBooksByAuthor(book.authors[0]);
        setBooksByAuthor(books);
      } catch (error) {
        console.error('Failed to fetch books by the author:', error);
      }
    }
  };
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarStatus,
    openSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const handleAddCopies = () => navigate('/admin/catalog/management/book-form', { state: { book, acquiredBook } });
  const handleEditTitle = () => {
    const newTitle = prompt('Edit the title of the book:', book.title);
    if (newTitle) {
      alert(`Title updated to: ${newTitle}`);
    }
  };

  const handleReserve = () => alert(`Book "${book.title}" reserved.`);

  const handleBorrow = async () => {
    const uncIdNumber = localStorage.getItem('uncIdNumber');
    if (!uncIdNumber) {
      openSnackbar("Please log in to borrow a book", "error");
      return;
    }

    try {
      const { department, hasCurrentBorrowedBook, registered } = await fetchBorrowerDetails(uncIdNumber);
      if (!registered) {
        openSnackbar("You didn't activate your account yet", "error");
        return;
      }
      if (hasCurrentBorrowedBook) {
        openSnackbar("You already have a current borrowed book. You cannot borrow another one.", "error");
        return;
      }

      // Get all copies of this book by ISBN13
      if (!book.isbn13) {
        openSnackbar("ISBN-13 is not available for this book", "error");
        return;
      }
      const allCopies = await getBooksByISBN(book.isbn13);
      // Find an available copy
      const availableCopy = allCopies.find(copy => copy.status !== "Loaned Out");

      if (!availableCopy) {
        openSnackbar("No available copies of this book. Please reserve instead.", "error");
        return;
      }

      const { title, callNumber, authors } = await fetchBookDetails(availableCopy.accessionNo);

      // Set up confirmation details with the available copy
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);

      setBorrowDetails({
        accessionNo: availableCopy.accessionNo,
        title,
        callNumber,
        authors: Array.isArray(authors) ? authors.join(', ') : authors,
        uncIdNumber,
        department,
        dueDate: dueDate.toLocaleString()
      });
      setConfirmDialogOpen(true);
    } catch (error) {
      console.error('Error preparing borrow:', error);
      openSnackbar("Error preparing borrow request", "error");
    }
  };

  const handleConfirmBorrow = async () => {
    if (!borrowDetails) return;

    const loanData = {
      accessionNo: borrowDetails.accessionNo,
      title: borrowDetails.title,
      callnum: borrowDetails.callNumber,
      author: borrowDetails.authors.split(', '),
      uncIdNumber: borrowDetails.uncIdNumber,
      department: borrowDetails.department,
      dateReturned: null,
    };

    try {
      await saveLoanDetails(loanData);
      openSnackbar(`Successfully borrowed ${borrowDetails.title}`, "success");
      setConfirmDialogOpen(false);
      navigate('/user/browse', { state: { refresh: true } });
    } catch (error) {
      console.error('Error saving loan:', error);
      openSnackbar("Failed to process borrow request", "error");
    }
  };

  const handleAddToWishlist = () => alert(`Book "${book.title}" added to your wishlist.`);

  const handleBookClick = (book: Book) =>
    navigate(`/user/book/${book.id}`, { state: { book, source } });

  const handleGoBack = () => {
    const path = UserService.isLibrarian() || UserService.isAdmin()
      ? '/user/catalog/management/search-title'
      : '/user/browse';
    navigate(path, { state: { searchState: state?.searchState } });
  };

  const handleSideBarClick = () => setSidebarOpen(!isSidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
        <Container>
          <Header
            buttons={
              <>
                <Button sx={{ backgroundColor: '#ea4040', color: 'white' }}
                  onClick={handleGoBack}>
                  Go Back
                </Button>
                <IconButton onClick={handleSideBarClick}>
                  <MenuIcon style={{ color: "#ea4040", marginLeft: "10px" }} />
                </IconButton>
              </>

            }


          />
          {/* <Header buttons={ } /> */}
        </Container>


        <Box sx={{ flexGrow: 1, padding: 2, margin: '20px auto', maxWidth: 900, backgroundColor: '#f9f9f9', borderRadius: 3, boxShadow: 2, position: 'relative' }}>
          {/* Larger Bookmark Icon */}
          <BookmarkIcon sx={{ color: 'red', fontSize: 100, position: 'absolute', top: -5, right: 30 }} />


          <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
            <CardMedia
              component="img"
              image={book.thumbnail}
              alt={book.title}
              sx={{ width: 200, height: 300, objectFit: 'cover', borderRadius: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ marginBottom: 1, fontWeight: 'bold' }}>{book.title}</Typography>
              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>Authors: {book.authors.join(', ')}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}><strong>Publisher:</strong> {book.publisher || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}><strong>Published Date:</strong> {book.publishedDate || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}><strong>Page Count:</strong> {book.pageCount || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}><strong>Categories:</strong> {book.categories || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}><strong>Language:</strong> {book.language || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}><strong>ISBN-10:</strong> {book.isbn10 || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}><strong>ISBN-13:</strong> {book.isbn13 || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}><strong>Description:</strong> {book.description || 'No description available.'}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginY: 3 }} onClick={handleToggleBooksByAuthor}>
            {showBooks ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            <Typography sx={{ marginLeft: 1, fontWeight: 'bold' }}>{showBooks ? 'Hide Books by This Author' : 'More on This Author'}</Typography>
          </Box>

          <Collapse in={showBooks}>
            {booksByAuthor && <BookList books={booksByAuthor} onBookClick={handleBookClick} source={source} />}
          </Collapse>



          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', marginTop: 2 }}>
            {UserService.adminOnly() && (
              <>
                <Button sx={{ backgroundColor: '#ea4040', color: 'white' }} onClick={handleAddCopies}>Catalog</Button>
                <Button sx={{ backgroundColor: '#ea4040', color: 'white' }} onClick={handleEditTitle}>Edit Title</Button>

              </>
            )}
            {source !== "Z39.50/SRU" && (
              <>
                <Button sx={{ backgroundColor: '#ea4040', color: 'white' }} onClick={handleReserve}>Reserve item</Button>
                <Button sx={{ backgroundColor: '#ea4040', color: 'white' }} onClick={handleBorrow}>Borrow item</Button>

              </>

            )}

            <Button sx={{ backgroundColor: '#ea4040', color: 'white' }} onClick={handleAddToWishlist}>Add to Wishlist</Button>
          </Box>


        </Box>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
          <DialogTitle>Confirm Loan</DialogTitle>
          <DialogContent>
            {borrowDetails && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography><strong>Accession Number:</strong> {borrowDetails.accessionNo}</Typography>
                <Typography><strong>Book Title:</strong> {borrowDetails.title}</Typography>
                <Typography><strong>Call Number:</strong> {borrowDetails.callNumber}</Typography>
                <Typography><strong>Author:</strong> {borrowDetails.authors}</Typography>
                <Typography><strong>Borrower:</strong> {borrowDetails.uncIdNumber}</Typography>
                <Typography><strong>Department:</strong> {borrowDetails.department}</Typography>
                <Typography><strong>Due:</strong> {borrowDetails.dueDate}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmBorrow} color="primary">Confirm</Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
          <Alert onClose={closeSnackbar} severity={snackbarStatus}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Footer />s
      </Box>
    </>
  );
};

export default BookDetails;