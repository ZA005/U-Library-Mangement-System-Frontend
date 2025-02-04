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
import { useFetchAllBooksNotReferenced } from "./useFetchBooks";
import { useFilteredBooks } from "./useFilteredBook";
import { useMultiSelect } from "./useMultiSelect";
import { useConfirmationDialog } from "./useConfirmationDialog";
import { Course } from "../../../services/Curriculum/CourseService";
import useAddBookRef from "./useAddBookRef";
import useAddMultipleBookRef from "./useAddMultipleBookRef";
import { Book } from "../../../model/Book";
import { useSnackbar } from "../../../hooks/useSnackbar";
interface BookReferenceProps {
    course: Course;
    onClose: () => void;
}

const BookReferenceDialog: React.FC<BookReferenceProps> = ({ course, onClose }) => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { books, loading, error } = useFetchAllBooksNotReferenced(course.course_id, refreshTrigger);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const addBookRefHook = useAddBookRef();
    const addMultipleBookRefHook = useAddMultipleBookRef();
    const filteredBooks = useFilteredBooks(books, searchTerm);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // Pagination state
    const [page, setPage] = useState<number>(1);
    const [rowsPerPage] = useState<number>(5);

    const { multiSelectMode, selectedBooks, toggleMultiSelectMode, handleCheckboxChange } = useMultiSelect();
    const { openSnackbar } = useSnackbar();

    const singleSelectConfirmation = useConfirmationDialog(
        async () => {
            if (selectedBook) {
                try {
                    await addBookRefHook.addNewBookRef(course.course_id, course.course_name, selectedBook);
                    openSnackbar(`Book Reference Added: ${selectedBook.title}`, "success");
                    setRefreshTrigger(prev => prev + 1);
                } catch (error) {
                    openSnackbar("Failed to add book reference. Please try again.", "error");
                }
            } else {
                openSnackbar("No book selected.", "error");
            }
            setSelectedBook(null);
        },
        () => setSelectedBook(null)
    );

    const multiSelectConfirmation = useConfirmationDialog(
        async () => {
            if (selectedBooks.length > 0) {
                try {
                    await addMultipleBookRefHook.addNewMultipleBookRef(course.course_id, course.course_name, selectedBooks);
                    openSnackbar(`Books successfully added as references: ${selectedBooks.map((book) => book.title).join(", ")}`, "success");
                    setRefreshTrigger(prev => prev + 1);
                } catch (error) {
                    openSnackbar("Failed to add book references. Please try again.", "error");
                }
            } else {
                openSnackbar("No books selected.", "error");
            }
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
                Select Referenced Book for {course.course_name}
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

            {/* Single Selection Confirmation Dialog */}
            <Dialog open={singleSelectConfirmation.isOpen} onClose={singleSelectConfirmation.cancelAction}>
                <DialogTitle>Confirm Your Selection</DialogTitle>
                <DialogContent>
                    Are you sure you want to select this book?<br />
                    <strong>{selectedBook?.title}</strong>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={singleSelectConfirmation.confirmAction}
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#EA4040", borderColor: "#EA4040" }}
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={singleSelectConfirmation.cancelAction}
                        variant="outlined"
                        size="small"
                        sx={{ color: "#EA4040", borderColor: "#EA4040" }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Multi Selection Confirmation Dialog */}
            <Dialog open={multiSelectConfirmation.isOpen} onClose={multiSelectConfirmation.cancelAction}>
                <DialogTitle>Confirm Your Selection</DialogTitle>
                <DialogContent>
                    Are you sure you want to confirm the following books?
                    <ul>
                        {selectedBooks.map((book, index) => (
                            <li key={index}>{book.title}</li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={multiSelectConfirmation.cancelAction}
                        variant="outlined"
                        size="small"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={multiSelectConfirmation.confirmAction}
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#EA4040" }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default BookReferenceDialog;
