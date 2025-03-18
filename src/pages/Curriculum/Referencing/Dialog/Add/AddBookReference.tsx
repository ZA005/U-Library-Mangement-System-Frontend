import React, { useState } from "react";
import { Course, Books } from "../../../../../types";
import { List, ListItem, ListItemText, Box, TextField, Typography, Button, InputAdornment, Checkbox, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useFetchNotReferenceBookByCourse } from "../../useFetchNotBookReferenceBookByCourse";
import { useAddBookReference } from "./useAddBookReference";
import { useAddMultipleBookReference } from "./useAddMultipleBookReference";
import { ListPlus, CheckCheck, Search } from "lucide-react";
import { PROTECTED_ROUTES } from "../../../../../config/routeConfig";
import { useSnackbarContext } from "../../../../../contexts/SnackbarContext";
import BookReferenceDialog from "..";

interface AddBookReferenceProps {
    course: Course;
    onClose: () => void;
}

const AddBookReference: React.FC<AddBookReferenceProps> = ({ course, onClose }) => {
    const { isLoading, data: books, error, refetch } = useFetchNotReferenceBookByCourse(course.course_id);
    const { addBookReference } = useAddBookReference();
    const { addMultipleBookReference } = useAddMultipleBookReference();
    const [searchQuery, setSearchQuery] = useState("");
    const [multiSelectMode, setMultiSelectMode] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState<Books[]>([]);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmingBook, setConfirmingBook] = useState<Books | null>(null);
    const [isBulkConfirm, setIsBulkConfirm] = useState(false);

    const showSnackbar = useSnackbarContext();

    const handleSelectBook = (book: Books) => {
        setSelectedBooks((prev) =>
            prev.some((b) => b.isbn13 === book.isbn13) ? prev.filter((b) => b.isbn13 !== book.isbn13) : [...prev, book]
        );
    };

    const openConfirmationDialog = (book?: Books) => {
        if (book) {
            setConfirmingBook(book);
            setIsBulkConfirm(false);
        } else {
            setConfirmingBook(null);
            setIsBulkConfirm(true);
        }
        setConfirmationOpen(true);
    };

    const handleConfirmAddBook = () => {
        if (isBulkConfirm) {
            addMultipleBookReference({ course, books: selectedBooks }, {
                onSuccess: () => {
                    showSnackbar(`Successfully added ${selectedBooks.length} book(s) as reference for ${course.course_name}`, "success");
                    setSelectedBooks([]);
                    setMultiSelectMode(false);
                    refetch();
                },
                onError: (error) => showSnackbar(`${error}`, "error"),
            });
        } else if (confirmingBook) {
            addBookReference({ course, book: confirmingBook }, {
                onSuccess: () => {
                    showSnackbar(`Successfully added ${confirmingBook.title} as reference for ${course.course_name}`, "success");
                    refetch();
                },
                onError: (error) => showSnackbar(`${error}`, "error"),
            });
        }
        setConfirmationOpen(false);
    };

    const handleViewBook = (book: Books) => {
        const bookUrl = PROTECTED_ROUTES.BOOKINFORMATION.replace(":isbn", book.isbn13 || book.isbn10);
        sessionStorage.setItem("selectedBook", JSON.stringify(book));
        window.open(bookUrl, "_blank");
    };

    const toggleMultiSelectMode = () => {
        setMultiSelectMode((prev) => !prev);
        setSelectedBooks([]);
    };

    const content = (
        <>
            <TextField
                size="small"
                label="Search Book Reference"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search size={15} />
                        </InputAdornment>
                    ),
                }}
                sx={{ marginBottom: 2 }}
            />
            {isLoading ? (
                <Box display="flex" justifyContent="center">
                    <Typography>Loading...</Typography>
                </Box>
            ) : error ? (
                <Typography>Error fetching book references</Typography>
            ) : books?.length > 0 ? (
                <List>
                    {books.map((book, index) => (
                        <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            {multiSelectMode && (
                                <Checkbox checked={selectedBooks.some((b) => b.isbn13 === book.isbn13)} onChange={() => handleSelectBook(book)} />
                            )}
                            <ListItemText primary={book.title} secondary={`ISBN13: ${book.isbn13} | Copyright: ${book.copyRight} | Author(s): ${book.authors}`} />
                            {!multiSelectMode && (
                                <Box display="flex" alignItems="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ marginRight: 2, backgroundColor: "#EA4040" }}
                                        onClick={() => openConfirmationDialog(book)}
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
                <Typography>No book found</Typography>
            )}
        </>
    );

    const actions = multiSelectMode ? (
        <Button
            onClick={() => openConfirmationDialog()}
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#EA4040" }}
            disabled={selectedBooks.length === 0}
        >
            Done ({selectedBooks.length})
        </Button>
    ) : null;

    return (
        <>
            <BookReferenceDialog
                open={true}
                title={`Select Book to be reference for ${course.course_name}`}
                onClose={onClose}
                iconButtons={[
                    <IconButton onClick={toggleMultiSelectMode}>
                        {multiSelectMode ? <CheckCheck color="#d32f2f" /> : <ListPlus color="#d32f2f" />}
                    </IconButton>
                ]}
                content={content}
                actions={actions}
            />

            <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                <DialogTitle>Confirm Book Addition</DialogTitle>
                <DialogContent>
                    {isBulkConfirm ? (
                        <>
                            <Typography>Are you sure you want to add the following books for {course.course_name}?</Typography>
                            <ul>
                                {selectedBooks.map((book) => (
                                    <li key={book.isbn13}>{book.title}</li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <Typography>Are you sure you want to add <b>{confirmingBook?.title}</b> for <b>{course.course_name}</b>?</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmAddBook} variant="contained" sx={{ backgroundColor: "#d32f2f" }}>Confirm</Button>
                    <Button onClick={() => setConfirmationOpen(false)} sx={{ color: "#d32f2f" }}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddBookReference;