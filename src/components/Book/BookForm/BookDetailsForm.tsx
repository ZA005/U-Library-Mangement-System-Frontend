import React from "react";
import { TextField, Box, Button } from "@mui/material";

interface BookDetailsFormProps {
    title: string;
    setTitle: (value: string) => void;
    authors: string[];
    setAuthors: React.Dispatch<React.SetStateAction<string[]>>;
    publisher: string;
    setPublisher: (value: string) => void;
    publishedDate: string;
    setPublishedDate: (value: string) => void;
    isbn10: string;
    setIsbn10: (value: string) => void;
    isbn13: string;
    setIsbn13: (value: string) => void;
    desc: string;
    setDesc: (value: string) => void;
    pageCount: number | null;
    setPageCount: (value: number | null) => void;
    categories: string[];
    setCategories: (value: string[]) => void;
    language: string;
    setLanguage: (value: string) => void;
    printType: string;
    setPrintType: (value: string) => void;
    handleNext: () => void;
}

const BookDetailsForm: React.FC<BookDetailsFormProps> = ({
    title,
    setTitle,
    authors,
    setAuthors,
    publisher,
    setPublisher,
    publishedDate,
    setPublishedDate,
    isbn10,
    setIsbn10,
    isbn13,
    setIsbn13,
    desc,
    setDesc,
    pageCount,
    setPageCount,
    categories,
    setCategories,
    language,
    setLanguage,
    printType,
    setPrintType,
    handleNext
}) => {
    return (
        <Box>
            <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
            />
            <TextField
                fullWidth
                label="Author/s"
                value={authors}
                onChange={(e) => setAuthors(e.target.value.split(",").map((author) => author.trim()))}
                sx={{ mb: 2 }}
                size="small"
            />
            <TextField
                fullWidth
                label="Publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
            />
            <TextField
                fullWidth
                label="Publication Date"
                type="date"
                value={publishedDate || ""}
                onChange={(e) => setPublishedDate(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                fullWidth
                label="ISBN10"
                value={isbn10}
                onChange={(e) => setIsbn10(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
            />
            <TextField
                fullWidth
                label="ISBN13"
                value={isbn13}
                onChange={(e) => setIsbn13(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
            />
            <TextField
                fullWidth
                label="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
            />
            <TextField
                fullWidth
                label="Pages"
                type="number"
                value={pageCount !== null ? pageCount : ""}
                onChange={(e) => setPageCount(Number(e.target.value))}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Categories"
                value={categories.join(", ")}
                onChange={(e) => setCategories(e.target.value.split(",").map((c) => c.trim()))}
                sx={{ mb: 2 }}
                size="small"
            />
            <TextField
                fullWidth
                label="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
            />
            <TextField
                fullWidth
                label="Material Type"
                value={printType}
                onChange={(e) => setPrintType(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ background: "#ea4040", mb: 2 }}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default BookDetailsForm;
