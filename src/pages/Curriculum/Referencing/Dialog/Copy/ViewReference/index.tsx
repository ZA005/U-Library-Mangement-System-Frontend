import React, { useState, useEffect } from "react";
import { useFetchBookReferencesByCourse } from "../../View/useFetchBookReferenceByCourse";
import { useAddMultipleBookReference } from "../../Add/useAddMultipleBookReference";
import getBookByID from "../../../../../../services/Catalog/getBookByID";
import { useSnackbarContext } from "../../../../../../contexts/SnackbarContext";
import { CustomDialog, Loading } from "../../../../../../components";
import { Box, List, ListItem, ListItemText, Typography, Button, Dialog, DialogTitle, DialogActions, DialogContent } from "@mui/material";
import { Course, Books } from "../../../../../../types";

interface ViewBookReferenceProps {
    course: Course;
    onClose: () => void;
}

const ViewBookReference: React.FC<ViewBookReferenceProps> = ({ course, onClose }) => {
    const { isLoading: isFetchingReferences, data: bookReferences, error: errorFetchingReferences, refetch } = useFetchBookReferencesByCourse(course.course_id);
    const { addMultipleBookReference } = useAddMultipleBookReference();
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(true);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [books, setBooks] = useState<Books[]>([]);
    const showSnackbar = useSnackbarContext();

    const handleViewDialogClose = () => {
        setIsViewDialogOpen(false);
        onClose();
    };

    const openConfirmationDialog = () => {
        setConfirmationOpen(true);
        console.log("Confirmation dialog opened");
    };

    const handleConfirmAddBook = () => {
        if (books.length) {
            addMultipleBookReference(
                { course, books },
                {
                    onSuccess: () => {
                        showSnackbar(`Successfully added ${books.length} book(s) as reference for ${course.course_name}`, "success");
                        refetch();
                    },
                    onError: (error) => showSnackbar(`${error}`, "error"),
                }
            );
        }
        setConfirmationOpen(false);
    };

    useEffect(() => {
        const fetchBooks = async () => {
            if (!bookReferences || bookReferences.length === 0) return;

            try {
                const booksData: Books[] = await Promise.all(
                    bookReferences.map(async (bookReference) => {
                        try {
                            const book = await getBookByID(bookReference.book_id);
                            return book || null;
                        } catch (error) {
                            console.error(`Error fetching book ID ${bookReference.book_id}:`, error);
                            return null;
                        }
                    })
                );

                setBooks(booksData.filter((book): book is Books => book !== null));
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, [bookReferences]);


    const content = (
        <>
            {isFetchingReferences ? (
                <Box display="flex" justifyContent="center">
                    <Loading />
                </Box>
            ) : errorFetchingReferences ? (
                <Typography>Error fetching book references</Typography>
            ) : books?.length > 0 ? (
                <List>
                    {books.map((book, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={book.title}
                                secondary={`Copyright: ${book.copyRight} | Author(s): ${book.authors}`}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No book references found</Typography>
            )}
        </>
    );

    const copyButton = (
        <Button
            onClick={openConfirmationDialog}
            variant="contained"
            size="small"
            sx={{
                backgroundColor: "#d32f2f"
            }}
        >
            Copy
        </Button>
    );

    return (
        <>
            {isViewDialogOpen && (
                <CustomDialog
                    open={true}
                    dialogSize="sm"
                    title={`Book References for ${course.course_name}`}
                    onClose={handleViewDialogClose}
                    content={content}
                    actions={copyButton}
                />
            )}

            {/* Confirmation Dialog */}
            <Dialog open={confirmationOpen} onClose={() => {
                setConfirmationOpen(false);
                console.log("Confirmation dialog closed (Cancel)");
            }}>
                <DialogTitle>Confirm Book Addition</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to copy these references for <b>{course.course_name}</b>?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleConfirmAddBook}
                        variant="contained"
                        sx={{ backgroundColor: "#d32f2f" }}
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={() => {
                            setConfirmationOpen(false);
                            console.log("Confirmation dialog closed (Cancel)");
                        }}
                        sx={{ color: "#d32f2f" }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ViewBookReference;
