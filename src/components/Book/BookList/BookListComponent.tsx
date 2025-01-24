import React from 'react';
import { Book } from '../../../model/Book';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent, CardMedia, Link, Container } from '@mui/material';

interface BookListProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  source: string;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick, source }) => {
  const navigate = useNavigate();

  // Function to remove duplicates based on book id
  const getUniqueBooks = (books: Book[]) => {
    const uniqueBooks: Book[] = [];
    const seenIds = new Set();

    books.forEach((book) => {
      if (!seenIds.has(book.id)) {
        seenIds.add(book.id);
        uniqueBooks.push(book);
      }
    });

    return uniqueBooks;
  };

  // Function to determine the availability status based on the number of duplicates
  const availabilityStatus = (book: Book, bookCount: number) => {
    if (bookCount > 1) {
      return `Available (${bookCount} copies)`; // Adjust the message based on the count of duplicates
    }
    return 'Available'; // If there's only one copy, it's available
  };

  // Count the duplicates of each book
  const countBookDuplicates = (book: Book) => {
    return books.filter(b => b.id === book.id).length;
  };

  // Get unique books (no duplicates)
  const uniqueBooks = getUniqueBooks(books);

  // Click handler for checkout button
  const handleCheckout = (book: Book) => {
    console.log(`Checkout clicked for book: ${book.title}`);
    // Add your logic for "Checkout" action (like opening a modal or redirecting)
  };

  // Click handler for place hold button
  const handlePlaceHold = (book: Book) => {
    console.log(`Place Hold clicked for book: ${book.title}`);
    // Add your logic for "Place Hold" action (like opening a modal or redirecting)
  };

  return (
    <Container sx={{ p: 2, maxWidth: 'lg' }}>
      {uniqueBooks.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {uniqueBooks.map((book) => {
            // Get the number of duplicates for this book
            const bookCount = countBookDuplicates(book);

            return (
              <Card
                key={book.id}
                sx={{
                  display: 'flex',
                  width: "100%",
                  boxShadow: 2,
                  flexDirection: 'row', // Set the layout to row
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => onBookClick(book)}
              >
                {/* Book Thumbnail (Image on the left) */}
                <CardMedia
                  component="img"
                  src={book.thumbnail}
                  alt={book.title}
                  sx={{
                    width: 150,
                    height: 200,
                    objectFit: 'cover',
                    borderTopLeftRadius: 2,
                    borderBottomLeftRadius: 2,
                  }}
                />

                {/* Book Details (Text on the right) */}
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <strong>Authors:</strong>{' '}
                    <Link
                      href="/about-author"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/about-author');
                      }}
                      sx={{ color: 'primary.main', textDecoration: 'none' }}
                    >
                      {book.authors.join(', ')}
                    </Link>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <strong>Publisher:</strong> {book.publisher || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <strong>Published Date:</strong> {book.publishedDate || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    <strong>ISBN:</strong> {book.isbn10 || book.isbn13 || 'N/A'}
                  </Typography>

                  {/* Availability status based on duplicates */}
                  {source !== "Google Books" && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: availabilityStatus(book, bookCount) === 'Available' ? 'success.main' : 'error.main',
                      }}
                    >
                      {availabilityStatus(book, bookCount)}
                    </Typography>
                  )}
                </CardContent>

                {/* Action buttons */}
                {source !== "Google Books" && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: 1,
                      gap: 1,
                      borderTop: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckout(book);
                      }}
                    >
                      Checkout
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaceHold(book);
                      }}
                    >
                      Place Hold
                    </Button>
                  </Box>
                )}
              </Card>
            );
          })}
        </Box>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          No results found
        </Typography>
      )}
    </Container>
  );
};

export default BookList;
