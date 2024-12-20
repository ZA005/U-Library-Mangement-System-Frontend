import { useLocation, useNavigate } from 'react-router-dom';

interface Book {
    id: string;
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    language?: string;
    isbn10?: string;
    isbn13?: string;
    thumbnail?: string;
    printType?: string;
}

const BookDetails: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const book: Book = state?.book;
    const handleGoBack = () => {
        // Go back to BookSearch with search state
        navigate('/search-book', { state: { searchState: state?.searchState } });
    };

    const handleAddCopies = async () => {
        navigate('/book-form', { state: { book } });
    };

    const handleEditTitle = () => {
        const newTitle = prompt(`Edit the title of the book:`, book.title);
        if (newTitle) {
            alert(`Title updated to: ${newTitle}`);
            // Add your logic here for saving the updated title
        }
    };

    const handleAddToWishlist = () => {
        alert(`Book "${book.title}" added to your wishlist.`);
        // Add your logic here for adding to wishlist
    };

    return (
        <div>
            <button onClick={handleGoBack}>Go Back</button>
            <img src={book.thumbnail} alt={book.title} style={{ width: '150px', height: '225px' }} />
            <h1>{book.title}</h1>
            <p><strong>Authors:</strong> {book.authors.join(', ')}</p>
            <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
            <p><strong>Published Date:</strong> {book.publishedDate || 'N/A'}</p>
            <p><strong>Page Count:</strong> {book.pageCount || 'N/A'}</p>
            <p><strong>Categories:</strong> {book.categories?.join(', ') || 'N/A'}</p>
            <p><strong>Language:</strong> {book.language || 'N/A'}</p>
            <p><strong>ISBN-10:</strong> {book.isbn10 || 'N/A'}</p>
            <p><strong>ISBN-13:</strong> {book.isbn13 || 'N/A'}</p>
            <p><strong>Description:</strong> {book.description || 'No description available.'}</p>
            <p><strong>Item Type:</strong> {book.printType || 'N/A'}</p>

            {/* Buttons for actions */}
            <div style={{ marginTop: '20px' }}>
                <button onClick={handleAddCopies} style={{ marginRight: '10px' }}>Add Copies</button>
                <button onClick={handleEditTitle} style={{ marginRight: '10px' }}>Edit Title</button>
                <button onClick={handleAddToWishlist}>Add to Wishlist</button>
            </div>
        </div>
    );
};

export default BookDetails;
