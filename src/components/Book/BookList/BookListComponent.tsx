import React from 'react';
import { Book } from '../../../model/Book';
import { Box, Typography, Card, CardContent, CardMedia, Container } from '@mui/material';

interface BookListProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  source: string;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick, source }) => {

  // Function to remove duplicates based on book id
  const getUniqueBooks = (books: Book[]): Book[] => {
    const uniqueBooks: Book[] = [];
    const seenISBNs = new Set<string>();

    books.forEach((book) => {
      if (book.isbn13 && !seenISBNs.has(book.isbn13)) {
        seenISBNs.add(book.isbn13);
        uniqueBooks.push(book);
      }
    });

    return uniqueBooks;
  };

  // Function to determine the availability status based on the number of duplicates
  const availabilityStatus = (book: Book, availableCount: number) => {
    if (availableCount === 0) {
      return 'Not Available';
    } else if (availableCount > 1) {
      return `${availableCount} Copies Available`;
    }
    return 'Available';
  };

  // Count the duplicates of each book
  const countBookDuplicates = (book: Book) => {
    return books.filter(b =>
      b.isbn13 === book.isbn13 &&
      b.status !== "Loaned Out"
    ).length;
  };

  // Get unique books (no duplicates)
  const uniqueBooks = getUniqueBooks(books);

  // Click handler for checkout button
  // const handleCheckout = (book: Book) => {
  //   console.log(`Checkout clicked for book: ${book.title}`);
  //   // Add your logic for "Checkout" action (like opening a modal or redirecting)
  // };

  // // Click handler for place hold button
  // const handlePlaceHold = (book: Book) => {
  //   console.log(`Place Hold clicked for book: ${book.title}`);
  //   // Add your logic for "Place Hold" action (like opening a modal or redirecting)
  // };

  return (
    <Container sx={{ p: 2, maxWidth: 'lg' }}>
      {uniqueBooks.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {uniqueBooks.map((book) => {
            // Get the number of duplicates for this book
            const availableCount = countBookDuplicates(book);

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
                    <strong>Authors:</strong>{' '}{book.authors.join(', ')}
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
                  {source !== "Z39.50/SRU" && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: availableCount === 0 ? 'error.main' :
                          availableCount === 1 ? 'warning.main' :
                            'success.main',
                      }}
                    >
                      {availabilityStatus(book, availableCount)}
                    </Typography>
                  )}
                </CardContent>

                {/* Action buttons */}
                {/* {source !== "Z39.50/SRU" && (
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
                )} */}
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
