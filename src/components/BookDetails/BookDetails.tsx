import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { Book } from '../../model/Book';
import { getBooksByAuthor } from '../../services/LocalBooksAPI';
import { useState } from 'react';
import BookList from '../BookList/BookListComponent';

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
    }

    const handleBorrow = () => {
        alert(`Book "${book.title}" to borrow.`);
        // Add your logic here for borrow book
    }

    const handleAddToWishlist = () => {
        alert(`Book "${book.title}" added to your wishlist.`);
        // Add your logic here for adding to wishlist
    };
    const handleBookClick = (book: Book) => {
        navigate(`/user/book/${book.id}`, {
            state: { book },
        })
    };


    return (
        <div>
            {UserService.isAdmin() && (
                <button onClick={() => navigate('/admin/catalog/management/search-title', { state: { searchState: state?.searchState } })}>
                    Go Back</button>
            )}
            {UserService.isUser() && (
                <button onClick={() => navigate('/user/browse', { state: { searchState: state?.searchState } })}>
                    Go Back</button>
            )}

            <img src={book.thumbnail} alt={book.title} style={{ width: '150px', height: '225px' }} />
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

            <button onClick={handleToggleBooksByAuthor} style={{ marginTop: '20px' }}>
                {showBooks ? 'Hide Books by This Author' : 'More on This Author'}
            </button>

            {showBooks && booksByAuthor && (
                <BookList books={booksByAuthor} onBookClick={handleBookClick} />
            )}

            {/* Buttons for actions */}
            <div style={{ marginTop: '20px' }}>

                {/* Buttons for admins */}
                {UserService.isAdmin() && (
                    <button onClick={handleAddCopies} style={{ marginRight: '10px' }}>
                        Add Copies</button>
                )}
                {UserService.isAdmin() && (
                    <button onClick={handleEditTitle} style={{ marginRight: '10px' }}>
                        Edit Title</button>
                )}

                {/* Buttons for USERS  */}
                <button onClick={handleReserve}>Reserve item</button>
                <button onClick={handleBorrow}>Borrow item</button>
                <button onClick={handleAddToWishlist}>Add to Wishlist</button>
            </div>
        </div>
    );
};

export default BookDetails;
