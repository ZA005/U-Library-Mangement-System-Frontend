import { Box, Typography } from "@mui/material";
import CardComponent from "../../Book/BookCard";
import { Books } from "../../../types";

interface BookGridProps {
    searchQuery?: string;
    books: Books[];
    acquisitionData?: unknown;
}

const BookGrid: React.FC<BookGridProps> = ({ searchQuery, books = [], acquisitionData }) => {
    const filteredBooks = books.filter(book =>
        searchQuery ? book.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

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
            {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                    <CardComponent
                        book={book}
                        acquisitionData={acquisitionData}
                    />
                ))
            ) : (
                <Typography>No books found</Typography>
            )}
        </Box>
    );
};

export default BookGrid;
