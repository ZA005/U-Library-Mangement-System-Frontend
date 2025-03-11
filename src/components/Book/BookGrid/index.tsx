import { Box, Typography } from "@mui/material";
import CardComponent from "../../Book/BookCard";
import { Books } from "../../../types";

interface BookGridProps {
    searchQuery?: string;
    books: Books[];
}
// UPDATE INTEFACE TO ACCEPT BOOK OBJECT TO BE RENDERED
// const books = [
//     {
//         title: "React Guide asd asd asd asd  asd asd asd ",
//         authors: "Dan Abramov",
//         isbn: "978-1-23-456789-0",
//         publisher: "O'Reilly Media",
//         copiesAvailable: 5,
//         thumbnail: "https://dummyimage.com/1600x2560/000/fff"
//     },
//     {
//         title: "JavaScript Basics",
//         authors: "Kyle Simpson",
//         isbn: "978-1-23-456789-1",
//         publisher: "No Starch Press",
//         copiesAvailable: 3,
//         thumbnail: "https://dummyimage.com/1600x2560/000/fff"
//     },
//     {
//         title: "Advanced TypeScript",
//         authors: "Anders Hejlsberg",
//         isbn: "978-1-23-456789-2",
//         publisher: "Packt Publishing",
//         copiesAvailable: 2,
//         thumbnail: "https://dummyimage.com/1600x2560/000/fff"
//     },
//     {
//         title: "UI/UX Design",
//         authors: "Steve Krug",
//         isbn: "978-1-23-456789-3",
//         publisher: "Peachpit Press",
//         copiesAvailable: 4,
//         thumbnail: "https://dummyimage.com/1600x2560/000/fff"
//     }
// ];

const BookGrid: React.FC<BookGridProps> = ({ searchQuery, books = [] }) => {
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
                filteredBooks.map((book, index) => (
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
