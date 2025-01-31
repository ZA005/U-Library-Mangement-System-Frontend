/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import {
    Container, Box, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel, IconButton,
    Chip
} from '@mui/material';
import Sidebar from '../../../components/Sidebar';
import Header from '../../Header/Header';
import MenuIcon from "@mui/icons-material/Menu";
import Copyright from '../../Footer/Copyright';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateCallNumber, saveBook } from '../../../services/Cataloging/GoogleBooksApi';
import { fetchCopyNumBookExist, fetchLastAccessionNumber } from '../../../services/Cataloging/LocalBooksAPI';
import { Locations, Sections } from '../../../model/Book';
import LocationSelect from './LocationSelect';
import SectionSelect from './SectionSelect';
import BookConditionSelect from './BookConditionOptions';

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
    const acquiredBook = state?.acquiredBook;

    // Form state management
    const [status, setStatus] = useState('Available');
    const [bookCondition, setBookCondition] = useState('New');
    const [collectionType, setCollectionType] = useState('Book');
    const [callNumber, setCallNumber] = useState('');
    const [purchasePrice, setPurchasePrice] = useState(acquiredBook.purchase_price || '');
    const [section, setSection] = useState('');
    const [sections, setSections] = useState<Sections[]>([]);
    const [dateAcquired, setDateAcquired] = useState(acquiredBook.acquired_date || '');
    const [categories, setCategories] = useState(book.categories || '');
    const [notes, setNotes] = useState('');
    const [vendor, setVendor] = useState(acquiredBook.vendor || '');
    const [fundingSource, setFundingSource] = useState(acquiredBook.funding_source || '');
    const [subjects, setSubjects] = useState('');
    const [numberOfCopies, setNumberOfCopies] = useState<number | null>(1);
    const [accessionNumbers, setAccessionNumbers] = useState<string[]>([]);
    const [locations, setLocations] = useState<Locations[]>([]);
    const [location, setSelectedLocation] = useState('');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    const generateAccessionNumbers = useCallback(async () => {
        // Find the location object that matches the selectedLocation
        const selectedLoc = locations.find(loc => loc.locationCodeName === location);

        // Use locationCodeName if found, otherwise default to 'UNK'
        const prefix = selectedLoc ? selectedLoc.locationCodeName : 'UNK';

        try {
            const lastAccessionNumber = await fetchLastAccessionNumber(prefix);
            const lastNumber = parseInt(lastAccessionNumber.split('-')[1], 10) || 0;
            const baseNumber = (lastNumber + 1).toString().padStart(6, '0');
            const baseAccessionNumber = `${prefix}-${baseNumber}`;
            const numbers = Array.from({ length: numberOfCopies! }, (_, index) =>
                `${baseAccessionNumber} c.${index + 1}`
            );
            setAccessionNumbers(numbers);
        } catch (error) {
            console.error('Error fetching accession numbers:', error);
            alert('Failed to fetch accession numbers. Please try again.');
        }
    }, [location, locations, numberOfCopies]);


    const handleGenerateCallNumber = useCallback(async () => {
        try {
            const category = state.book.categories[0];
            const authors = book.authors;
            const publishedDate = state.book.publishedDate;
            const title = book.title;
            const callNumber = await generateCallNumber(category, authors, publishedDate, title);
            setCallNumber(callNumber);
            console.log(callNumber);
        } catch (error) {
            alert('Error generating call number. Please try again.');
            console.error(error);
        }
    }, [state.book.categories, state.book.publishedDate, book.authors, book.title]);


    useEffect(() => {
        setCallNumber(book.callNumber || '');
        if (!book.callNumber) {
            handleGenerateCallNumber(); // Generate call number if it doesn't exist
        }
    }, [book.callNumber, handleGenerateCallNumber]);

    useEffect(() => {
        if (location && numberOfCopies! > 0) {
            generateAccessionNumbers();
        }
    }, [location, numberOfCopies, generateAccessionNumbers]);

    const handleSave = async () => {
        // Ensure all fields are valid before proceeding
        if (!numberOfCopies || numberOfCopies < 1 || accessionNumbers.length === 0) {
            alert("Please specify a valid number of copies and ensure accession numbers are generated.");
            return;
        }

        // Find the location object that matches the locationCodeName
        const selectedLoc = locations.find(loc => loc.locationCodeName === location);
        const booksToSave = accessionNumbers.map((accessionNumber) => ({
            bookId: book.id,
            title: book.title,
            accessionNo: accessionNumber, // Unique for each copy
            authors: book.authors.map((author) => ({ name: author })),
            callNumber,
            purchasePrice,
            status,
            section,
            dateAcquired,
            categories: Array.isArray(categories) ? categories : categories?.split(','),
            notes,
            location: selectedLoc?.locationName,
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
            collectionType,
            bookCondition
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
        navigate(-1);
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
                        <Typography variant="h6"><strong>ISBN:</strong> {state.book.isbn13}</Typography>
                        <Typography variant="h6"><strong>Accession Numbers:</strong></Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', maxWidth: '100%', overflowX: 'auto', padding: 1 }}>
                            {accessionNumbers.length > 0 ? (
                                accessionNumbers.map((number, index) => (
                                    <Chip key={index} label={number} sx={{ backgroundColor: '#f5f5f5', fontSize: '0.9rem' }} />
                                ))
                            ) : (
                                <Typography variant="body1">N/A - Set Location to generate Accession number/s</Typography>
                            )}
                        </Box>


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
                                value={numberOfCopies !== null ? numberOfCopies : ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setNumberOfCopies(value === "" ? null : Number(value));
                                }}
                                onBlur={() => {
                                    if (numberOfCopies === null) {
                                        setNumberOfCopies(1);
                                    }
                                }}
                                inputProps={{ min: 1 }}
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

                            <LocationSelect
                                selectedLocation={location}
                                setSelectedLocation={setSelectedLocation}
                                locations={locations}
                                setLocations={setLocations}
                            />

                            <SectionSelect
                                selectedSection={section}
                                setSelectedSection={setSection}
                                sections={sections}
                                setSections={setSections}
                                selectedLocation={location}
                                locations={locations}
                            />

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

                            <BookConditionSelect bookCondition={bookCondition} setBookCondition={setBookCondition} />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="collectionType-label">Collection Type</InputLabel>
                                <Select
                                    labelId="collectionType-label"
                                    value={collectionType}
                                    onChange={(e) => setCollectionType(e.target.value)}
                                    label="Collection Type"
                                    size="small"
                                >
                                    <MenuItem value="Book">Book</MenuItem>
                                    <MenuItem value="Journals">Journals</MenuItem>
                                    <MenuItem value="Theses & Dissertation">Theses & Dissertation</MenuItem>
                                    <MenuItem value="Special Collections">Special Collections</MenuItem>
                                    <MenuItem value="Museum and Archival Materials">Museum and Archival Materials</MenuItem>
                                </Select>
                            </FormControl>

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