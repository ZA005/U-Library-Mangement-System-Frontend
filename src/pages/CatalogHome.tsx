import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Line from "../components/Line/Line";
import Copyright from "../components/Footer/Copyright";
import BookList from "../components/BookList/BookListComponent";
import axios from "axios";
// import { Book } from "../model/Book";


interface Book {
    id: string;
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    isbn10?: string;
    isbn13?: string;
    thumbnail: string;
}
const CatalogHome: React.FC = () => {
    // const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        axios.get("/adminuser/all-books")
            .then((response) => {
                const bookData = Array.isArray(response.data) ? response.data : [response.data];
                setBooks(bookData);
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
            });
    }, []);

    // const handleBookClick = (book: Book) => {
    //     console.log("Selected book:", book);
    // };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header buttons={<></>} />

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                    fontWeight="bold"
                >
                    Browse Books
                </Typography>
                <Line />

                {/* <BookList books={books} onBookClick={handleBookClick} /> */}
            </Container>

            <Copyright />
        </Box>
    );
};

export default CatalogHome;
