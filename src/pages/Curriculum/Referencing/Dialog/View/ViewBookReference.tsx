import React, { useState, useEffect } from "react";
import { Course } from "../../../../../types";
import { List, ListItem, ListItemText, Box, TextField, Typography, InputAdornment, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Loading } from "../../../../../components";
import { useFetchBookReferencesByCourse } from "./useFetchBookReferenceByCourse";
import { useFetchBookByID } from "./useFetchBookByID";
import { useRemoveBookReference } from "./useRemoveBookReference";
import { useSnackbarContext } from "../../../../../contexts/SnackbarContext";
import { Plus, Search, Trash, Copy } from "lucide-react";
import { PROTECTED_ROUTES } from "../../../../../config/routeConfig";
import { CustomDialog } from "../../../../../components";
import AddBookReference from "../Add/AddBookReference";

interface ViewBookReferenceProps {
    course: Course;
    onClose: () => void;
}

const ViewBookReference: React.FC<ViewBookReferenceProps> = ({ course, onClose }) => {
    const { isLoading: isFetchingReferences, data: bookReferences, error: errorFetchingReferences, refetch } = useFetchBookReferencesByCourse(course.course_id);
    const { removeReference } = useRemoveBookReference();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddBookOpen, setIsAddBookOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(true);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const { data: bookData, isLoading: isLoadingBookData } = useFetchBookByID(selectedBookId!);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [bookToRemove, setBookToRemove] = useState<{ id: number; name: string } | null>(null);
    const showSnackbar = useSnackbarContext();
    const [isViewingBook, setIsViewingBook] = useState(false);

    const handleAddBookClick = () => {
        setIsViewDialogOpen(false);
        setIsAddBookOpen(true);
    };

    const handleViewDialogClose = () => {
        setIsViewDialogOpen(false);
        onClose();
    };

    const handleAddBookClose = () => {
        setIsAddBookOpen(false);
        onClose();
    };

    const handleViewBook = (bookId: number) => {
        setSelectedBookId(bookId);
        setIsViewingBook(true);
    };

    useEffect(() => {
        // Only attempt to open the window when book data is loaded and we're in viewing mode
        if (isViewingBook && !isLoadingBookData && bookData) {
            const bookUrl = PROTECTED_ROUTES.BOOKINFORMATION.replace(":isbn", bookData?.isbn13 || bookData?.isbn10);
            sessionStorage.setItem("book", JSON.stringify(bookData));
            window.open(bookUrl, "_blank");
            setIsViewingBook(false);
        }
    }, [isViewingBook, isLoadingBookData, bookData]);

    const handleRemoveBook = (bookId: number, bookName: string) => {
        setBookToRemove({ id: bookId, name: bookName });
        setIsRemoveDialogOpen(true);
    };

    const confirmRemoveBook = () => {
        if (bookToRemove) {
            removeReference(bookToRemove.id, {
                onSuccess: () => {
                    showSnackbar(`Successfully removed ${bookToRemove.name}`);
                    refetch();
                },
                onError: (error) => showSnackbar(`${error}`, "error"),
            });
        }
        setIsRemoveDialogOpen(false);
        setBookToRemove(null);
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
            {isFetchingReferences ? (
                <Box display="flex" justifyContent="center">
                    <Loading />
                </Box>
            ) : errorFetchingReferences ? (
                <Typography>Error fetching book references</Typography>
            ) : bookReferences?.length > 0 ? (
                <List>
                    {bookReferences.map((book, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={book.book_name}
                                secondary={`ISBN13: ${book.isbn13} | Copyright: ${book.copyright} | Author(s): ${book.authors}`}
                            />
                            <Box display="flex" alignItems="center" gap={1}>
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                                    onClick={() => handleViewBook(book.book_id)}
                                    disabled={isLoadingBookData && isViewingBook}
                                >
                                    {isLoadingBookData && isViewingBook ? 'Loading...' : 'View Book'}
                                </Button>

                                <IconButton onClick={() => handleRemoveBook(book.id, book.book_name)}>
                                    <Trash color="#d32f2f" />
                                </IconButton>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No book references found</Typography>
            )}
        </>
    );

    return (
        <>
            {isViewDialogOpen && (
                <CustomDialog
                    open={true}
                    title={`Book References for ${course.course_name}`}
                    onClose={handleViewDialogClose}
                    iconButtons={[
                        <Copy size="20px" color="#d32f2f" onClick={handleAddBookClick} />,
                        <Plus size="20px" color="#d32f2f" onClick={handleAddBookClick} />
                    ]}
                    content={content}
                />
            )}
            {isAddBookOpen && <AddBookReference course={course} onClose={handleAddBookClose} />}

            <Dialog open={isRemoveDialogOpen} onClose={() => setIsRemoveDialogOpen(false)}>
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove <strong>{bookToRemove?.name}</strong> from the book references?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmRemoveBook} variant="contained" sx={{ backgroundColor: "#d32f2f" }}>
                        Remove
                    </Button>
                    <Button onClick={() => setIsRemoveDialogOpen(false)} sx={{ color: "#d32f2f" }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ViewBookReference;