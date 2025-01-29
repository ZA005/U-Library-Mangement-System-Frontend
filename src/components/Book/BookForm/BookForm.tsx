/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import {
    Container, Box, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel, IconButton
} from '@mui/material';
import Sidebar from '../../../components/Sidebar';
import Header from '../../Header/Header';
import MenuIcon from "@mui/icons-material/Menu";
import Copyright from '../../Footer/Copyright';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateCallNumber, saveBook } from '../../../services/Cataloging/GoogleBooksApi';
import { fetchCopyNumBookExist, fetchLastAccessionNumber } from '../../../services/Cataloging/LocalBooksAPI';

interface Book {
    id: string;
    title: string;
    authors: string[];
    callNumber?: string;
    thumbnail: string;
    categories?: string
    isbn10: string;
    isbn13: string;
}

const BookForm: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Retrieve the book data passed from BookDetails
    const book: Book = state.book;

    // Form state management
    const [status, setStatus] = useState('Available');
    const [barcode, setBarcode] = useState('');
    const [callNumber, setCallNumber] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [section, setSection] = useState('');
    const [dateAcquired, setDateAcquired] = useState('');
    const [categories, setCategories] = useState(book.categories || '');
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('');
    const [vendor, setVendor] = useState('');
    const [fundingSource, setFundingSource] = useState('');
    const [subjects, setSubjects] = useState('');
    const [numberOfCopies, setNumberOfCopies] = useState(1);
    const [accessionNumbers, setAccessionNumbers] = useState<string[]>([]);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    const generateAccessionNumbers = useCallback(async () => {
        const locationPrefixes: { [key: string]: string } = {
            eLibrary: 'E',
            'Graduate Studies Library': 'GS',
            'Law Library': 'L',
            'Engineering and Architecture Library': 'EA',
            'High School Library': 'HS',
            'Elementary Library': 'EL',
        };

        const prefix = locationPrefixes[location] || 'UNK';

        try {
            // Fetch the generated accession numbers from the backend
            const response = await fetchCopyNumBookExist(book.title, book.isbn10, book.isbn13, prefix);

            if (response !== "NOTFOUND") {
                console.log("Generated Accession Numbers:", response);
                // setAccessionNumbers(response); // Backend returns a list of accession numbers
            } else {
                alert('No accession numbers found for this book. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching accession numbers:', error);
            alert('Failed to fetch accession numbers. Please try again.');
        }
    }, [location, book.title, book.isbn10, book.isbn13]);








    const handleGenerateCallNumber = useCallback(async () => {
        try {
            const category = state.book.categories[0];
            const authors = book.authors;
            const publishedDate = state.book.publishedDate;
            const title = book.title;
            const callNumber = await generateCallNumber(category, authors, publishedDate, title);
            setCallNumber(callNumber); // Update the state with the generated call number
        } catch (error) {
            alert('Error generating call number. Please try again.');
            console.error(error);
        }
    }, [state.book.categories, state.book.publishedDate, book.authors, book.title]);

    useEffect(() => {
        if (!book.callNumber) {
            handleGenerateCallNumber(); // Generate call number if it doesn't exist
        }
    }, [book.callNumber, handleGenerateCallNumber]);

    useEffect(() => {
        if (location && numberOfCopies > 0) {
            generateAccessionNumbers();
        }
    }, [location, numberOfCopies, generateAccessionNumbers]);

    const handleSave = async () => {
        // Ensure all fields are valid before proceeding
        if (!numberOfCopies || numberOfCopies < 1 || accessionNumbers.length === 0) {
            alert("Please specify a valid number of copies and ensure accession numbers are generated.");
            return;
        }


        const booksToSave = accessionNumbers.map((accessionNumber) => ({
            bookId: book.id,
            title: book.title,
            accessionNo: accessionNumber, // Unique for each copy
            authors: book.authors.map((author) => ({ name: author })),
            callNumber,
            purchasePrice,
            status,
            barcode,
            section,
            dateAcquired,
            categories: Array.isArray(categories) ? categories : categories?.split(','),
            notes,
            location,
            vendor,
            fundingSource,
            subjects: subjects.split(','),
            thumbnail: book.thumbnail,
            description: state.book.description,
            isbn13: state.book.isbn13,
            isbn10: state.book.isbn10,
            language: state.book.language,
            pageCount: state.book.pageCount,
            publishedDate: state.book.publishedDate,
            publisher: state.book.publisher,
            printType: state.book.printType,
        }));

        try {

            // Save each book entry
            for (const bookData of booksToSave) {
                await saveBook(bookData);
            }

            alert('Book details saved successfully!');
            navigate(-1); // Go back to the previous page
        } catch (error) {
            console.error(error);
            alert('Failed to save book. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header
                    buttons={
                        <>
                            <IconButton onClick={handleSideBarClick}>
                                <MenuIcon style={{ color: "#EA4040" }} />
                            </IconButton>
                        </>
                    }
                />
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box maxWidth="sm" sx={{
                        mt: 2,
                        border: '1px solid #d3d3d3',
                        borderRadius: '4px',
                        padding: 2,
                        boxShadow: '0px 0px 5px rgba(0,0,0,0.1)'
                    }}>
                        <Typography variant="h4"><strong>Title:</strong> {book.title}</Typography>
                        <Typography variant="h6"><strong>Authors:</strong> {book.authors.join(', ')}</Typography>
                        <Typography variant="h6"><strong>Call Number:</strong> {callNumber || 'N/A'}</Typography>

                        <Box component="form" sx={{ mt: 2 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    label="Status"
                                    size="small"
                                >
                                    <MenuItem value="Available">Available</MenuItem>
                                    <MenuItem value="In Processing">In Processing</MenuItem>
                                    <MenuItem value="Loaned Out">Loaned Out</MenuItem>
                                    <MenuItem value="On Order">On Order</MenuItem>
                                    <MenuItem value="Out for Repairs">Out for Repairs</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Number of Copies"
                                type="number"
                                value={numberOfCopies}
                                onChange={(e) => setNumberOfCopies(Number(e.target.value))}
                                inputProps={{ min: 1 }}
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <TextField
                                fullWidth
                                label="Starting Barcode"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <TextField
                                fullWidth
                                label="Call Number"
                                value={callNumber}
                                onChange={(e) => setCallNumber(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <TextField
                                fullWidth
                                label="Purchase Price"
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="location-label">Location</InputLabel>
                                <Select
                                    labelId="location-label"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    label="Location"
                                    size="small"
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="eLibrary">eLibrary</MenuItem>
                                    <MenuItem value="Graduate Studies Library">Graduate Studies Library</MenuItem>
                                    <MenuItem value="Law Library">Law Library</MenuItem>
                                    <MenuItem value="Engineering and Architecture Library">Engineering and Architecture Library</MenuItem>
                                    <MenuItem value="High School Library">High School Library</MenuItem>
                                    <MenuItem value="Elementary Library">Elementary Library</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="section-label">Section</InputLabel>
                                <Select
                                    labelId="section-label"
                                    value={section}
                                    onChange={(e) => setSection(e.target.value)}
                                    label="Section"
                                    size="small"
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="General Reference">General Reference</MenuItem>
                                    <MenuItem value="Circulation">Circulation</MenuItem>
                                    <MenuItem value="Periodical">Periodical</MenuItem>
                                    <MenuItem value="Filipiniana">Filipiniana</MenuItem>
                                    <MenuItem value="Special Collection">Special Collection</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Date Acquired"
                                type="date"
                                value={dateAcquired}
                                onChange={(e) => setDateAcquired(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                fullWidth
                                label="Categories"
                                value={categories}
                                onChange={(e) => setCategories(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <TextField
                                fullWidth
                                label="Notes"
                                multiline
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Vendor"
                                value={vendor}
                                onChange={(e) => setVendor(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <TextField
                                fullWidth
                                label="Funding Source"
                                value={fundingSource}
                                onChange={(e) => setFundingSource(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <TextField
                                fullWidth
                                label="Subjects"
                                value={subjects}
                                onChange={(e) => setSubjects(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <Box sx={{ mt: 2 }} paddingBottom="15px">
                                <Button variant="contained" onClick={handleSave} sx={{ mr: 2, background: "#ea4040" }}>Save</Button>
                                <Button variant="outlined" onClick={handleCancel} sx={{ borderColor: "#ea4040", color: "#ea4040" }}>Cancel</Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
            <Copyright />
        </Box>
    );
};

export default BookForm;