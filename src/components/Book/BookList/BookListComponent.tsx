import React from 'react';
import { Book } from '../../../model/Book';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent, CardMedia, Link, Container } from '@mui/material';

interface BookListProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick }) => {
  const navigate = useNavigate();

  // Static availability for each book (you can adjust these as needed)
  const availabilityStatus = (book: Book) => {
    if (book.title === 'Some Book Title') {
      return 'Not Available'; // Example of unavailable book
    }
    return 'Available'; // Default status for all other books
  };

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
      {books.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {books.map((book) => (
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

                {/* Static Availability status */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    color: availabilityStatus(book) === 'Available' ? 'success.main' : 'error.main',
                  }}
                >
                  {availabilityStatus(book)}
                </Typography>
              </CardContent>

              {/* Action buttons */}
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
            </Card>
          ))}
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
