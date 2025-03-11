import { Box, Typography } from "@mui/material";
import CardComponent from "../../Book/BookCard";
import { Books } from "../../../types";

interface BookGridProps {
    searchQuery?: string;
    books: Books[];
    limit?: number;
}

const BookGrid: React.FC<BookGridProps> = ({ searchQuery, books = [], limit }) => {
    const filteredBooks = books.filter(book =>
        searchQuery ? book.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

    const displayedBooks = filteredBooks.slice(0, limit || 20);

    return (
        <Box
            display="grid"
            gridTemplateColumns={{
                xs: "1fr",
                sm: "1fr",
                md: "1fr 1fr"
            }}
            gap={2}
            justifyContent="center"
            width="100%"
        >
            {displayedBooks.length > 0 ? (
                displayedBooks.map((book, index) => (
                    <CardComponent
                        key={index}
                        title={book.title}
                        authors={book.authors}
                        isbn={book.isbn13}
                        publisher={book.publisher}
                        copiesAvailable={book.bookCatalog.copies}
                        thumbnail={book.thumbnail}
                    />
                ))
            ) : (
                <Typography>No books found</Typography>
            )}
        </Box>
    );
};

export default BookGrid;
