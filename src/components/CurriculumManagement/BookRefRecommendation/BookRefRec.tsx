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

interface Book {
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

const recommendedBooks = {
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
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [multiSelectMode, setMultiSelectMode] = useState<boolean>(false); // Multi-select toggle
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]); // Selected books in multi-select mode

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleMultiSelectMode = () => {
        setMultiSelectMode(!multiSelectMode);
        setSelectedBooks([]); // Reset selections when toggling mode
    };

    const handleCheckboxChange = (book: Book) => {
        setSelectedBooks((prevSelectedBooks) => {
            if (prevSelectedBooks.includes(book)) {
                // If already selected, remove it
                return prevSelectedBooks.filter((b) => b !== book);
            } else {
                // Otherwise, add it
                return [...prevSelectedBooks, book];
            }
        });
    };

    const handleDoneMultiSelect = () => {
        const bookTitles = selectedBooks.map((book) => book.title).join(", ");
        alert(`You have selected these books: ${bookTitles}`);
        setMultiSelectMode(false);
        setSelectedBooks([]);
    };

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
        alert(`You have selected the book: ${book.title}`);
    };

    const handleViewBook = (book: Book) => {
        alert(`Viewing details for ${book.title}\nISBN: ${book.isbn}\nLanguage: ${book.language}\nLocation: ${book.location}\nSection: ${book.section}`);
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
                                    {multiSelectMode ? (
                                        <Checkbox
                                            checked={selectedBooks.includes(book)}
                                            onChange={() => handleCheckboxChange(book)}
                                        />
                                    ) : null}
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
                            onClick={handleDoneMultiSelect}
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: "#EA4040" }}
                        >
                            Done
                        </Button>
                    )}
                    <Button
                        onClick={onClose}
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#EA4040" }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookRefRec;
