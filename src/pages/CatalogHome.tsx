// src/pages/CatalogHome.tsx
import { Box, Container, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import MenuIcon from "@mui/icons-material/Menu";
import Line from "../components/Line/Line";
import Copyright from "../components/Footer/Copyright";
import BookList from "../components/BookList/BookListComponent";
import { getAllBooks } from "../services/LocalBooksAPI";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Book } from "../model/Book";

// interface Book {
//     id: string;
//     title: string;
//     authors: string[];
//     publisher?: string;
//     publishedDate?: string;
//     isbn10?: string;
//     isbn13?: string;
//     thumbnail: string;
// }

const CatalogHome: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const bookData = await getAllBooks(); // Fetching the books using the API
                const mappedBookData = bookData.map((book: Book) => ({
                    id: book.id,
                    title: book.title,
                    authors: book.authors || [],
                    publisher: book.publisher,
                    publishedDate: book.publishedDate,
                    isbn10: book.isbn10,
                    isbn13: book.isbn13,
                    thumbnail: book.thumbnail || 'default-thumbnail.jpg',
                    description: book.description,
                    language: book.language,
                    categories: book.categories,
                    pageCount: book.pageCount,
                    printType: book.printType
                }));
                setBooks(mappedBookData);
            } catch (err) {
                console.error("Error fetching books:", err);
                setError("Failed to fetch books from the database.");
            }
        };

        fetchBooks();
    }, []);

    const handleBookClick = (book: Book) => {
        navigate(`/user/book/${book.id}`, {
            state: { book },
        })
    };

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header
                    buttons={
                        <>
                            <IconButton onClick={handleSideBarClick}>
                                <MenuIcon style={{ color: "#EA4040" }} />
                            </IconButton>
                        </>
                    }
                />

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                    fontWeight="bold"
                >
                   Library Catalog
                </Typography>
                <Line />
                <Box display= "flex" flexDirection="row" justifyContent="space-between">
                    <Box width="20vw" height="100vh" bgcolor="red"></Box>
                    <Box width="50vw" height="100vh" bgcolor="blue" mr="10px" ml="10px" overflow="auto">  {books.length === 0 ? (
                    <Typography>No books available.</Typography>
                ) : (
                    <BookList books={books} onBookClick={handleBookClick} />
                )}</Box>
                    <Box width="20vw" height="100vh" bgcolor="yellow"></Box>
                </Box>

                {error && <Typography color="error">{error}</Typography>}

               
            </Container>

            <Copyright />
        </Box>
    );
};

export default CatalogHome;
