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
} from "@mui/material";
import { PlaylistAddCheck, DoneAll } from "@mui/icons-material";

import { useFilteredBooks } from "./useFilteredBook";
import { useMultiSelect } from "./useMultiSelect";
import { useConfirmationDialog } from "./useConfirmationDialog";

export interface Book {
    title: string;
    isbn: string;
    language: string;
    location: string;
    section: string;
}

interface Subject {
    id: number;
    program_id: number;
    program_name: string;
    department_name: string;
    subject_name: string;
    year: number;
    status: number;
}

interface BookRefRecProps {
    subject: Subject;
    onClose: () => void;
}

const recommendedBooks: Record<string, Book[]> = {
    'Introduction to Computing': [
        {
            title: "Algebra Essentials by John Doe",
            isbn: "978-1234567890",
            language: "English",
            location: "Shelf A1",
            section: "Mathematics"
        },
        {
            title: "Calculus for Beginners by Jane Smith",
            isbn: "978-0987654321",
            language: "English",
            location: "Shelf B2",
            section: "Mathematics"
        }
    ],
    Physics: [
        {
            title: "Physics Fundamentals by Richard Feynman",
            isbn: "978-1122334455",
            language: "English",
            location: "Shelf C3",
            section: "Physics"
        },
        {
            title: "Quantum Mechanics Simplified by Niels Bohr",
            isbn: "978-9988776655",
            language: "English",
            location: "Shelf D4",
            section: "Physics"
        }
    ],
    Chemistry: [
        {
            title: "Organic Chemistry by Linus Pauling",
            isbn: "978-4455667788",
            language: "English",
            location: "Shelf E5",
            section: "Chemistry"
        },
        {
            title: "Chemical Reactions by Marie Curie",
            isbn: "978-5566778899",
            language: "English",
            location: "Shelf F6",
            section: "Chemistry"
        }
    ],
};


const BookRefRec: React.FC<BookRefRecProps> = ({ subject, onClose }) => {
    const books = recommendedBooks[subject.subject_name] || [];
    const [searchTerm, setSearchTerm] = useState<string>("");
    const filteredBooks = useFilteredBooks(books, searchTerm);

    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const { multiSelectMode, selectedBooks, toggleMultiSelectMode, handleCheckboxChange } = useMultiSelect();

    const singleSelectConfirmation = useConfirmationDialog(
        () => alert(`You have selected the book: ${selectedBook?.title}`),
        () => setSelectedBook(null)
    );

    const multiSelectConfirmation = useConfirmationDialog(
        () => {
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
        singleSelectConfirmation.openDialog();
    };

    return (
        <>
            <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>
                    Recommended Books for {subject.subject_name}
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
                    <List>
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book, index) => (
                                <ListItem key={index}>
                                    {multiSelectMode && (
                                        <Checkbox
                                            checked={selectedBooks.includes(book)}
                                            onChange={() => handleCheckboxChange(book)}
                                        />
                                    )}
                                    <ListItemText
                                        primary={book.title}
                                        secondary={`ISBN: ${book.isbn}, Language: ${book.language}, Location: ${book.location}, Section: ${book.section}`}
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
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No books found." />
                            </ListItem>
                        )}
                    </List>
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

            <Dialog open={singleSelectConfirmation.isOpen} onClose={singleSelectConfirmation.cancelAction}>
                <DialogTitle>Confirm Your Selection</DialogTitle>
                <DialogContent>
                    Are you sure you want to select this book?<br />
                    <strong>{selectedBook?.title}</strong>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={singleSelectConfirmation.cancelAction}
                        variant="outlined"
                        size="small"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={singleSelectConfirmation.confirmAction}
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#EA4040" }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

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
        </>
    );
};

export default BookRefRec;
