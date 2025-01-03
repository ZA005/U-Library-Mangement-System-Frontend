import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../../services/UserService';
import { Book } from '../../../model/Book';
import { getBooksByAuthor } from '../../../services/LocalBooksAPI';
import { useState } from 'react';
import BookList from '../BookList/BookListComponent';
import './BookDetails.css';
import Header from '../Header/Header';
import Footer from '../Footer/Copyright';
import { Box } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const BookDetails: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showBooks, setShowBooks] = useState(false);
  const [booksByAuthor, setBooksByAuthor] = useState<Book[] | null>(null);

  const book: Book = state?.book;

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

  const handleAddCopies = () => navigate('/admin/book-form', { state: { book } });

  const handleEditTitle = () => {
    const newTitle = prompt('Edit the title of the book:', book.title);
    if (newTitle) {
      alert(`Title updated to: ${newTitle}`);
      // Add logic to update title
    }
  };

  const handleReserve = () => alert(`Book "${book.title}" reserved.`);
  const handleBorrow = () => alert(`Book "${book.title}" borrowed.`);
  const handleAddToWishlist = () => alert(`Book "${book.title}" added to your wishlist.`);

  const handleBookClick = (book: Book) =>
    navigate(`/user/book/${book.id}`, { state: { book } });

  const handleGoBack = () => {
    const path = UserService.isAdmin()
      ? '/admin/catalog/management/search-title'
      : '/user/browse';
    navigate(path, { state: { searchState: state?.searchState } });
  };

  return (
    <div className="book-details-page">
      <Header buttons={<button className="go-back-button" onClick={handleGoBack}>Go Back</button>} />
      <div className="book-details-container">
        <div className="book-details-content">
          <img
            src={book.thumbnail}
            alt={book.title}
            className="book-details-image"
          />
          <div className="book-details-info">
            <h1>{book.title}</h1>
            <p><strong>Authors:</strong> {book.authors.join(', ')}</p>
            <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
            <p><strong>Published Date:</strong> {book.publishedDate || 'N/A'}</p>
            <p><strong>Page Count:</strong> {book.pageCount || 'N/A'}</p>
            <p><strong>Categories:</strong> {book.categories || 'N/A'}</p>
            <p><strong>Language:</strong> {book.language || 'N/A'}</p>
            <p><strong>ISBN-10:</strong> {book.isbn10 || 'N/A'}</p>
            <p><strong>ISBN-13:</strong> {book.isbn13 || 'N/A'}</p>
            <p><strong>Description:</strong> {book.description || 'No description available.'}</p>
            <p><strong>Item Type:</strong> {book.printType || 'N/A'}</p>
          </div>
        </div>

        <div className="book-details-toggle" onClick={handleToggleBooksByAuthor}>
          {showBooks ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          <span>{showBooks ? 'Hide Books by This Author' : 'More on This Author'}</span>
        </div>

        {showBooks && booksByAuthor && (
          <BookList books={booksByAuthor} onBookClick={handleBookClick} />
        )}

        <div className="book-details-actions">
          {UserService.isAdmin() && (
            <>
              <button onClick={handleAddCopies}>Add Copies</button>
              <button onClick={handleEditTitle}>Edit Title</button>
            </>
          )}
          <button onClick={handleReserve}>Reserve item</button>
          <button onClick={handleBorrow}>Borrow item</button>
          <button onClick={handleAddToWishlist}>Add to Wishlist</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookDetails;
