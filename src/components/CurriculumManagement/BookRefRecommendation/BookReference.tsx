import React, { useState } from "react";
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
    Checkbox,
    IconButton,
    Tooltip,
    CircularProgress,
    Typography,
    Pagination,
} from "@mui/material";
import { PlaylistAddCheck, DoneAll } from "@mui/icons-material";
import { useFetchAllBooks } from "./useFetchBooks";
import { useFilteredBooks } from "./useFilteredBook";
import { useMultiSelect } from "./useMultiSelect";
import { useConfirmationDialog } from "./useConfirmationDialog";
import { Course } from "../../../services/Curriculum/CourseService";
import { Book } from "../../../model/Book";

interface BookReferenceProps {
    course: Course;
    onClose: () => void;
}

const BookReference: React.FC<BookReferenceProps> = ({ course, onClose }) => {
    const { books, loading, error } = useFetchAllBooks(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredBooks = useFilteredBooks(books, searchTerm);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // Pagination state
    const [page, setPage] = useState<number>(1);
    const [rowsPerPage] = useState<number>(5);

    const { multiSelectMode, selectedBooks, toggleMultiSelectMode, handleCheckboxChange } = useMultiSelect();

    const singleSelectConfirmation = useConfirmationDialog(
        () => alert(`You have selected the book: ${selectedBook?.title}`),
        () => setSelectedBook(null)
    );

    const multiSelectConfirmation = useConfirmationDialog(
        () => {
            console.log("test")
            alert(`You have confirmed these books: ${selectedBooks.map((book) => book.title).join(", ")}`);
            toggleMultiSelectMode();
        },
        () => { }
    );

    const handleViewBook = (book: Book) => {
        const bookTitleEncoded = encodeURIComponent(book.title);
        const url = `https://www.google.com/search?udm=36&q=${bookTitleEncoded}`;
        window.open(url, "_blank");
    };

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
        console.log(book)
        singleSelectConfirmation.openDialog();
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const paginatedBooks = filteredBooks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Recommended Books for {course.course_name}
                <Tooltip title={multiSelectMode ? "Exit Multi-Select Mode" : "Enter Multi-Select Mode"}>
                    <IconButton onClick={toggleMultiSelectMode} sx={{ float: "right" }}>
                        {multiSelectMode ? <DoneAll /> : <PlaylistAddCheck />}
                    </IconButton>
                </Tooltip>
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
                                {multiSelectMode && (
                                    <Checkbox
                                        checked={selectedBooks.includes(book)}
                                        onChange={() => handleCheckboxChange(book)}
                                    />
                                )}
                                <ListItemText
                                    primary={book.title}
                                    secondary={`ISBN: ${book.isbn10}, Language: ${book.language}, Location: ${book.location}`}
                                />
                                {!multiSelectMode && (
                                    <Box display="flex" alignItems="center">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{ marginRight: 2, backgroundColor: "#EA4040" }}
                                            onClick={() => handleSelectBook(book)}
                                        >
                                            Select Book
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ color: "#EA4040", borderColor: "#EA4040" }}
                                            onClick={() => handleViewBook(book)}
                                        >
                                            View Book
                                        </Button>
                                    </Box>
                                )}
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No books found.</Typography>
                )}

                {/* Pagination */}
                <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
                    <Pagination
                        count={Math.ceil(filteredBooks.length / rowsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                {multiSelectMode && (
                    <Button
                        onClick={multiSelectConfirmation.openDialog}
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#EA4040" }}
                    >
                        Done
                    </Button>
                )}
                <Button
                    onClick={onClose}
                    variant="text"
                    size="small"
                    sx={{ color: "#EA4040" }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookReference;
