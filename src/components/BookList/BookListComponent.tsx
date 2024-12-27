import React from 'react';
import { Book } from '../../model/Book';
import { useNavigate } from 'react-router-dom';


interface BookListProps {
    books: Book[];
    onBookClick: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick }) => {
    const navigate = useNavigate();
    return (
        <div>
            {books.length > 0 ? (
                <ul>
                    {books.map((book) => (
                        <li
                            key={book.id}
                            style={{ marginBottom: '20px', cursor: 'pointer' }}
                            onClick={() => onBookClick(book)}
                        >
                            <img
                                src={book.thumbnail}
                                alt={book.title}
                                style={{
                                    width: '50px',
                                    height: '75px',
                                    marginRight: '10px',
                                }}
                            />
                            <h2>{book.title}</h2>
                            <p><strong>Authors:</strong> <a href="/about-author" onClick={() => navigate("/about-author")}>{book.authors.join(', ')}</a></p>
                            <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
                            <p><strong>Published Date:</strong> {book.publishedDate || 'N/A'}</p>
                            <p><strong>ISBN:</strong> {book.isbn10 || book.isbn13 || 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
};

export default BookList;
