import React, { useState } from "react";
import { Course } from "../../../../../types";
import { List, ListItem, ListItemText, Box, TextField, Typography, InputAdornment, Button } from "@mui/material";
import { Loading } from "../../../../../components";
import { useFetchBookReferencesByCourse } from "./useFetchBookReferenceByCourse";
import { useFetchBookByID } from "./useFetchBookByID";
import { Plus, Search, Trash } from "lucide-react";
import { PROTECTED_ROUTES } from "../../../../../config/routeConfig";
import BookReferenceDialog from "..";
import AddBookReference from "../Add/AddBookReference";

interface ViewBookReferenceProps {
    course: Course;
    onClose: () => void;
}

const ViewBookReference: React.FC<ViewBookReferenceProps> = ({ course, onClose }) => {
    const { isLoading: isFetchingReferences, data: bookReferences, error: errorFetchingReferences } = useFetchBookReferencesByCourse(course.course_id);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddBookOpen, setIsAddBookOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(true);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const { data: bookData } = useFetchBookByID(selectedBookId!);

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
        const bookUrl = PROTECTED_ROUTES.BOOKINFORMATION.replace(":isbn", bookData?.isbn13 || bookData?.isbn10);
        sessionStorage.setItem("book", JSON.stringify(bookData));
        window.open(bookUrl, "_blank");
    };

    console.log(bookReferences);
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
                                secondary={`ISBN10: ${book.isbn10} | ISBN13: ${book.isbn13} | Copyright: ${book.copyright}`}
                            />
                            <Box display="flex" alignItems="center">
                                {/* <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ marginRight: 2, backgroundColor: "#EA4040" }}
                                    onClick={() => handleSaveBook(book.book_id)}
                                >
                                    Select Book
                                </Button> */}
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{ color: "#EA4040", borderColor: "#EA4040" }}
                                    onClick={() => handleViewBook(book.book_id)}
                                >
                                    View Book
                                </Button>


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
                <BookReferenceDialog
                    open={true}
                    title={`Book References for ${course.course_name}`}
                    onClose={handleViewDialogClose}
                    iconButton={
                        <Plus
                            color="#d32f2f"
                            onClick={handleAddBookClick}
                        />
                    }
                    content={content}
                />
            )}
            {isAddBookOpen && <AddBookReference course={course} onClose={handleAddBookClose} />}
        </>
    );
};

export default ViewBookReference;
