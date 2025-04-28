import React, { useState, useEffect } from "react";
import { TextField, Typography, Box, Button } from "@mui/material";
import { useFetchBookReferencesByCourse } from "../../Referencing/Dialog/View/useFetchBookReferenceByCourse";
import { useFetchBookByID } from "../../Referencing/Dialog/View/useFetchBookByID";
import { PROTECTED_ROUTES } from "../../../../config/routeConfig";

interface RightContentProps {
    selectedCourseId: number | null;
}

const RightContent: React.FC<RightContentProps> = ({ selectedCourseId }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [isViewingBook, setIsViewingBook] = useState(false);

    const { data: bookReferences = [], isLoading } = useFetchBookReferencesByCourse(selectedCourseId ?? 0);
    const { data: bookData, isLoading: isLoadingBookData } = useFetchBookByID(selectedBookId!);


    const filteredBooks = bookReferences.filter((book: any) =>
        book.book_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewBookDetails = (bookId: number) => {
        setSelectedBookId(bookId);
        setIsViewingBook(true);
    };

    useEffect(() => {
        if (isViewingBook && !isLoadingBookData && bookData) {
            const bookUrl = PROTECTED_ROUTES.BOOKINFORMATION.replace(":isbn", bookData?.isbn13 || bookData?.isbn10);
            sessionStorage.setItem("book", JSON.stringify(bookData));
            window.open(bookUrl, "_blank");
            setIsViewingBook(false);
        }
    }, [isViewingBook, isLoadingBookData, bookData]);

    return (
        <>
            <TextField
                label="Search Books"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ marginBottom: "1rem" }}
            />

            {selectedCourseId === null ? (
                <Typography variant="body2" color="textSecondary">
                    Select a course to view the list of books.
                </Typography>
            ) : isLoading ? (
                <Typography variant="body2" color="textSecondary">
                    Loading book references...
                </Typography>
            ) : filteredBooks.length > 0 ? (
                <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Book List
                    </Typography>
                    {filteredBooks.map((book: any) => (
                        <Box
                            key={book.book_id}
                            display="flex"
                            flexDirection="column"
                            border="1px solid #ddd"
                            borderRadius="8px"
                            padding="1rem"
                            marginBottom="1rem"
                            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
                        >
                            <Typography variant="subtitle1" fontWeight="bold">
                                {book.book_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Author(s): {book.authors}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                ISBN: {book.isbn10} | {book.isbn13}
                            </Typography>
                            <Button
                                variant="outlined"
                                sx={{ marginTop: "0.5rem", textTransform: "none" }}
                                onClick={() => handleViewBookDetails(book.book_id)}
                                disabled={isLoadingBookData && isViewingBook}
                            >
                                {isLoadingBookData && isViewingBook ? "Loading..." : "View Details"}
                            </Button>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No books found for the selected course.
                </Typography>
            )}
        </>
    );
};

export default RightContent;
