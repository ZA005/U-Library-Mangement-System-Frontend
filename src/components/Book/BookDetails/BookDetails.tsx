import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../../services/UserService';
import { Book } from '../../../model/Book';
import { getBooksByAuthor } from '../../../services/LocalBooksAPI';
import { useState } from 'react';
import BookList from '../BookList/BookListComponent';
import './BookDetails.css';
import Header from '../../Header/Header'; // Import Header
import Footer from '../../Footer/Copyright'; // Import Footer
import { Box } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Import Arrow icon
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'; // Import Arrow icon

const BookDetails: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showBooks, setShowBooks] = useState<boolean>(false);
  const [booksByAuthor, setBooksByAuthor] = useState<Book[] | null>(null);

  const book: Book = state?.book;

  const handleToggleBooksByAuthor = async () => {
    setShowBooks(!showBooks); // Toggle visibility
    if (!showBooks && booksByAuthor === null) {
      try {
        const books = await getBooksByAuthor(book.authors[0]); // Assuming the first author is the primary one
        setBooksByAuthor(books);
      } catch (error) {
        console.error("Failed to fetch books by the author:", error);
      }
    }
  };

  const handleAddCopies = async () => {
    navigate('/admin/book-form', { state: { book } });
  };

  const handleEditTitle = () => {
    const newTitle = prompt(`Edit the title of the book:`, book.title);
    if (newTitle) {
      alert(`Title updated to: ${newTitle}`);
      // Add your logic here for saving the updated title
    }
  };

  const handleReserve = () => {
    alert(`Book "${book.title}" to reserve.`);
    // Add your logic here for reserving book
  };

  const handleBorrow = () => {
    alert(`Book "${book.title}" to borrow.`);
    // Add your logic here for borrow book
  };

  const handleAddToWishlist = () => {
    alert(`Book "${book.title}" added to your wishlist.`);
    // Add your logic here for adding to wishlist
  };

  const handleBookClick = (book: Book) => {
    navigate(`/user/book/${book.id}`, {
      state: { book },
    });
  };

  const goBackButton = (
    <button
      onClick={() => {
        if (UserService.isAdmin()) {
          navigate('/admin/catalog/management/search-title', { state: { searchState: state?.searchState } });
        } else if (UserService.isUser()) {
          navigate('/user/browse', { state: { searchState: state?.searchState } });
        }
      }}
      style={{ marginLeft: '-20px' }} // Adjust the margin to move the button to the left
    >
      Go Back
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header Section */}
      <Header buttons={goBackButton} />
      {/* Content Section */}
      <div className="book-details-container" style={{ flexGrow: 1, paddingBottom: '40px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <img src={book.thumbnail} alt={book.title} className="book-details-image" />
          <div className="book-details-text">
            <h1 className="book-details-title">{book.title}</h1>
            <p className="book-details-paragraph"><strong>Authors:</strong> {book.authors.join(', ')}</p>
            <p className="book-details-paragraph"><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
            <p className="book-details-paragraph"><strong>Published Date:</strong> {book.publishedDate || 'N/A'}</p>
            <p className="book-details-paragraph"><strong>Page Count:</strong> {book.pageCount || 'N/A'}</p>
            <p className="book-details-paragraph"><strong>Categories:</strong> {book.categories || 'N/A'}</p>
            <p className="book-details-paragraph"><strong>Language:</strong> {book.language || 'N/A'}</p>
            <p className="book-details-paragraph"><strong>ISBN-10:</strong> {book.isbn10 || 'N/A'}</p>
            <p className="book-details-paragraph"><strong>ISBN-13:</strong> {book.isbn13 || 'N/A'}</p>
            <p className="book-details-paragraph"><strong>Description:</strong> {book.description || 'No description available.'}</p>
            <p className="book-details-paragraph"><strong>Item Type:</strong> {book.printType || 'N/A'}</p>
          </div>
        </div>


        {/* Replace button with the arrow icon */}
        <div
          className="book-details-toggle-arrow"
          onClick={handleToggleBooksByAuthor}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {showBooks ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          <span style={{ marginLeft: '8px' }}>
            {showBooks ? 'Hide Books by This Author' : 'More on This Author'}
          </span>
        </div>

        {showBooks && booksByAuthor && (
          <div className="book-details-book-list">
            <BookList books={booksByAuthor} onBookClick={handleBookClick} />
          </div>
        )}

        <div className="book-details-actions">
          {UserService.isAdmin() && (
            <button className="book-details-action-button" onClick={handleAddCopies}>
              Add Copies
            </button>
          )}
          {UserService.isAdmin() && (
            <button className="book-details-action-button" onClick={handleEditTitle}>
              Edit Title
            </button>
          )}

          <button className="book-details-action-button" onClick={handleReserve}>
            Reserve item
          </button>
          <button className="book-details-action-button" onClick={handleBorrow}>
            Borrow item
          </button>
          <button className="book-details-action-button" onClick={handleAddToWishlist}>
            Add to Wishlist
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default BookDetails;
