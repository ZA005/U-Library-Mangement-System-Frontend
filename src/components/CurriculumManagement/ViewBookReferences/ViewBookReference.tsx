import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Button,
    TextField,
    Box,
    CircularProgress,
    Typography,
    Pagination,
    IconButton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Course } from "../../../services/Curriculum/CourseService";
import { useFetchBookRefByCourse } from "./useFetchBookRef";
import { BookReference } from "../../../services/Curriculum/BookReferenceService";
import BookReferenceDialog from "../BookRefRecommendation/BookReference";

interface ViewBookReferenceProps {
    course: Course;
    onClose: () => void;
}

const ViewBookReference: React.FC<ViewBookReferenceProps> = ({ course, onClose }) => {
    const { bookRef, loading, error } = useFetchBookRefByCourse(course.course_id);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [showBookReference, setShowBookReference] = useState<boolean>(false);
    const [localBookRef, setLocalBookRef] = useState<BookReference[]>(bookRef || []);
    const rowsPerPage = 5;

    useEffect(() => {
        // Update localBookRef whenever bookRef changes
        setLocalBookRef(bookRef || []);
    }, [bookRef]);

    // Filter books based on search input
    const filteredBooks = localBookRef.filter((book: BookReference) =>
        book.book_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Handle pagination
    const paginatedBooks = filteredBooks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleViewBook = (book: BookReference) => {
        const bookTitleEncoded = encodeURIComponent(book.book_name);
        const url = `https://www.google.com/search?udm=36&q=${bookTitleEncoded}`;
        window.open(url, "_blank");
    };

    const handleDeleteReference = () => {

    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleAddBook = () => {
        setShowBookReference(true);
    };

    const handleBookAdded = (newBook: BookReference) => {
        // Add the new book to the local state
        setLocalBookRef(prev => [...prev, newBook]);
        setShowBookReference(false);
        onClose(); // Close this dialog after adding a book
    };

    return (
        <>
            {!showBookReference ? (
                <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
                    <DialogTitle>
                        Referenced Book for {course.course_name}
                        <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
                            <IconButton
                                onClick={handleAddBook}
                                sx={{ color: "#EA4040" }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers sx={{ minHeight: "300px", maxHeight: "500px", overflow: "auto" }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Search books..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        />

                        {loading ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Typography color="error">Error fetching books: {error}</Typography>
                        ) : paginatedBooks.length > 0 ? (
                            <List>
                                {paginatedBooks.map((book, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={book.book_name}
                                            secondary={`ISBN: ${book.isbn10}, Language: ${book.language}, Location: ${book.location}`}
                                        />
                                        <Box display="flex" alignItems="center">
                                            <Button
                                                variant="text"
                                                size="small"
                                                sx={{ color: "#EA4040", borderColor: "#EA4040" }}
                                                onClick={() => handleViewBook(book)}
                                            >
                                                View Book
                                            </Button>
                                            <IconButton
                                                onClick={handleDeleteReference}
                                                sx={{ color: "#EA4040" }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography>No Book References Found.</Typography>
                        )}

                        {/* Pagination */}
                        {filteredBooks.length > rowsPerPage && (
                            <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
                                <Pagination
                                    count={Math.ceil(filteredBooks.length / rowsPerPage)}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} variant="text" size="small" sx={{ color: "#EA4040" }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <BookReferenceDialog course={course} onClose={handleBookAdded} />
            )}
        </>
    );
};

export default ViewBookReference;