/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import {
    Container, Box, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel, IconButton,
    Chip,
    Alert,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import Sidebar from '../../../components/Sidebar';
import Header from '../../Header/Header';
import MenuIcon from "@mui/icons-material/Menu";
import Copyright from '../../Footer/Copyright';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateCallNumber, saveBook } from '../../../services/Cataloging/GoogleBooksApi';
import { fetchLastAccessionNumber } from '../../../services/Cataloging/LocalBooksAPI';
import { Book, Locations, Sections } from '../../../model/Book';
import { useSnackbar } from '../../../hooks/useSnackbar';
import BookDetailsForm from './BookDetailsForm';
import BookMetadataForm from './BookMetadataForm';

const BookForm: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Retrieve the book data passed from BookDetails
    const book: Book = state.book;
    const acquiredBook = state?.acquiredBook;

    // Form state management
    const [step, setStep] = useState(1);
    const [bookCondition, setBookCondition] = useState('New');
    const [collectionType, setCollectionType] = useState('Book');
    const [sections, setSections] = useState<Sections[]>([]);
    const [numberOfCopies, setNumberOfCopies] = useState<number | null>(1);
    const [accessionNumbers, setAccessionNumbers] = useState<string[]>([]);
    const [locations, setLocations] = useState<Locations[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const [title, setTitle] = useState(book.title || '');
    const [authors, setAuthors] = useState<string[]>(book.authors || []);
    const [publisher, setPublisher] = useState(book.publisher || '');
    const [publishedDate, setPublishedDate] = useState(book.publishedDate || '');
    const [isbn10, setIsbn10] = useState(book.isbn10 || '');
    const [isbn13, setIsbn13] = useState(book.isbn13 || '');
    const [desc, setDesc] = useState(book.description || '');
    const [pageCount, setPageCount] = useState<number | null>(book.pageCount || null);
    const [categories, setCategories] = useState<string[]>(Array.isArray(book.categories) ? book.categories : []);
    const [language, setLanguage] = useState(book.language || '');
    const [printType, setPrintType] = useState(book.printType || '');
    const [status, setStatus] = useState<string>('Available');
    const [callNumber, setCallNumber] = useState('');
    const [purchasePrice, setPurchasePrice] = useState(acquiredBook?.purchase_price || '');
    const [section, setSection] = useState('');
    const [dateAcquired, setDateAcquired] = useState(acquiredBook?.acquired_date || '');
    const [notes, setNotes] = useState('');
    const [location, setSelectedLocation] = useState('');
    const [vendor, setVendor] = useState(acquiredBook?.vendor || '');
    const [fundingSource, setFundingSource] = useState(acquiredBook?.funding_source || '');
    const [subjects, setSubjects] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();
    const handleSideBarClick = () => { setSidebarOpen(!isSidebarOpen); };
    const handleSidebarClose = () => { setSidebarOpen(false); };
    const handleCloseConfirm = () => setConfirmOpen(false);

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
            openSnackbar("Accession number/s generated!", "success");
        } catch (error) {
            console.error('Error fetching accession numbers:', error);
            openSnackbar("Failed to generate accession number/s", "error");
        }
    }, [location, locations, numberOfCopies, openSnackbar]);

    const handleGenerateCallNumber = useCallback(async () => {
        try {
            const category = state.book.categories[0];
            const authors = book.authors;
            const publishedDate = state.book.publishedDate;
            const title = book.title;
            const callNumber = await generateCallNumber(category, authors, publishedDate, title);
            setCallNumber(callNumber);
        } catch (error) {
            openSnackbar("Failed to generate Call number", "error");
            console.error(error);
        }
    }, [state.book.categories, state.book.publishedDate, book.authors, book.title, openSnackbar]);

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

    const confirmSave = async () => {
        setConfirmOpen(false);
        // Find the location object that matches the locationCodeName
        const selectedLoc = locations.find(loc => loc.locationCodeName === location);
        const booksToSave = accessionNumbers.map((accessionNumber) => ({
            bookId: book.id,
            title: title,
            accessionNo: accessionNumber,
            authors: authors.map((author) => ({ name: author })),
            callNumber,
            purchasePrice,
            status,
            section,
            dateAcquired,
            categories,
            notes,
            location: selectedLoc?.locationName,
            vendor,
            fundingSource,
            subjects: subjects.split(','),
            thumbnail: book.thumbnail,
            description: desc,
            isbn13: isbn13,
            isbn10: isbn10,
            language: language,
            pageCount: pageCount,
            publishedDate: publishedDate,
            publisher: publisher,
            printType: printType,
            collectionType,
            bookCondition
        }));

        try {

            // Save each book entry
            for (const bookData of booksToSave) {
                await saveBook(bookData);
                openSnackbar(`${bookData.title} added to the catalog`, "success");
            }

            navigate(-1);
        } catch (error) {
            console.error(error);
            openSnackbar(`${title} failed to add to the catalog. Please try again`, "error");
        }
    }

    const handleSave = async () => {
        // Ensure all fields are valid before proceeding
        if (!numberOfCopies || numberOfCopies < 1 || accessionNumbers.length === 0) {
            openSnackbar("Please specify a valid number of copies and Location to ensure accession numbers are generated.", "error");
            return;
        }


    };

    const handleCancel = () => {
        navigate(-1);
    };
    const handleNext = () => { setStep(2); };
    const handleBack = () => { if (step === 2) setStep(1); };

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
                        {step === 1 ? (
                            <BookDetailsForm
                                handleNext={handleNext}
                                title={title}
                                setTitle={setTitle}
                                authors={authors}
                                setAuthors={setAuthors}
                                publisher={publisher}
                                setPublisher={setPublisher}
                                publishedDate={publishedDate}
                                setPublishedDate={setPublishedDate}
                                isbn10={isbn10}
                                setIsbn10={setIsbn10}
                                isbn13={isbn13}
                                setIsbn13={setIsbn13}
                                desc={desc}
                                setDesc={setDesc}
                                pageCount={pageCount}
                                setPageCount={setPageCount}
                                categories={categories}
                                setCategories={setCategories}
                                language={language}
                                setLanguage={setLanguage}
                                printType={printType}
                                setPrintType={setPrintType}
                            />
                        ) : (
                            <BookMetadataForm
                                handleBack={handleBack}
                                handleCancel={handleCancel}
                                handleSave={handleSave}
                                status={status}
                                setStatus={setStatus}
                                numberOfCopies={numberOfCopies}
                                setNumberOfCopies={setNumberOfCopies}
                                callNumber={callNumber}
                                setCallNumber={setCallNumber}
                                purchasePrice={purchasePrice}
                                setPurchasePrice={setPurchasePrice}
                                section={section}
                                setSection={setSection}
                                dateAcquired={dateAcquired}
                                setDateAcquired={setDateAcquired}
                                notes={notes}
                                setNotes={setNotes}
                                location={location}
                                setSelectedLocation={setSelectedLocation}
                                vendor={vendor}
                                setVendor={setVendor}
                                fundingSource={fundingSource}
                                setFundingSource={setFundingSource}
                                subjects={subjects}
                                setSubjects={setSubjects}
                                locations={locations}
                                setLocations={setLocations}
                                sections={sections}
                                setSections={setSections}
                                bookCondition={bookCondition}
                                setBookCondition={setBookCondition}
                                collectionType={collectionType}
                                setCollectionType={setCollectionType}
                            />
                        )}
                    </Box>
                </Box>
            </Container>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                <Alert onClose={closeSnackbar} severity={snackbarStatus}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog
                open={confirmOpen}
                onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Save"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to save this data?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmSave} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Copyright />
        </Box>
    );
};

export default BookForm;