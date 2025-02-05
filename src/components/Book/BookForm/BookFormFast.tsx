import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Select, MenuItem, Button, FormControl, InputLabel, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Chip,
    Alert,
    Snackbar
} from '@mui/material';
import Sidebar from '../../../components/Sidebar';
import Header from '../../Header/Header';
import MenuIcon from "@mui/icons-material/Menu";
import Copyright from '../../Footer/Copyright';
import useGenerateCallNumber from './useGenerateCallNumber';
import { useGenerateAccessionNumbers } from './useGenerateAccessionNumber';
import { saveBook } from '../../../services/Cataloging/GoogleBooksApi';
import { Locations, Sections } from '../../../model/Book';
import BookDetailsForm from './BookDetailsForm';
import BookMetadataForm from './BookMetadataForm';
import { useSnackbar } from '../../../hooks/useSnackbar';


const BookFormFast: React.FC = () => {
    const { state } = useLocation();
    const bookData = state?.bookData;
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [ddcNumber, setDDCNumber] = useState('');
    const [title, setTitle] = useState(bookData.book_title || '');
    const [author, setAuthor] = useState<string[]>([]);
    const [publisher, setPublisher] = useState(bookData.publisher || '');
    const [publishedDate, setPublishedDate] = useState(bookData.publishedDate || '');
    const [isbn10, setIsbn10] = useState(bookData.isbn10 || '');
    const [isbn, setIsbn] = useState(bookData?.isbn || '');
    const [description, setDescription] = useState('');
    const [pageCount, setPageCount] = useState<number | null>(bookData.pageCount || null);
    const [categories, setCategories] = useState<string[]>(Array.isArray(bookData.categories) ? bookData.categories : []);
    const [language, setLanguage] = useState(bookData.language || '');
    const [printType, setPrintType] = useState(bookData.printType || '');
    const [status, setStatus] = useState<string>('Available');
    const callNumber = useGenerateCallNumber({ bookTitle: bookData?.book_title || '', author: author.join(', '), ddcNumber, publishedDate: bookData?.published_date });
    const [purchasePrice, setPurchasePrice] = useState(bookData?.purchase_price || '');
    const [section, setSection] = useState('');
    const [dateAcquired, setDateAcquired] = useState(bookData?.acquired_date || '');
    const [notes, setNotes] = useState('');
    const [numberOfCopies, setNumberOfCopies] = useState<number | null>(1);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [vendor, setVendor] = useState(bookData?.vendor || '');
    const [fundingSource, setFundingSource] = useState(bookData?.funding_source || '');
    const [sections, setSections] = useState<Sections[]>([]);
    const [subjects, setSubjects] = useState('');
    const [locations, setLocations] = useState<Locations[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [bookCondition, setBookCondition] = useState('New');
    const [collectionType, setCollectionType] = useState('Book');



    const ddcClasses = [
        { value: '000', label: '[000] General Information' },
        { value: '100', label: '[100] Philosophy and Psychology' },
        { value: '200', label: '[200] Religion' },
        { value: '300', label: '[300] Social Sciences' },
        { value: '400', label: '[400] Language' },
        { value: '500', label: '[500] Natural Sciences and Mathematics' },
        { value: '600', label: '[600] Technology' },
        { value: '700', label: '[700] Art and Recreation' },
        { value: '800', label: '[800] Literature' },
        { value: '900', label: '[900] Geography and History' }
    ];

    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();

    // Find the location object that matches the selectedLocation
    const selectedLoc = locations.find(loc => loc.locationCodeName === selectedLocation);

    // Use locationCodeName if found, otherwise default to ''
    const locationPrefix = selectedLoc ? selectedLoc.locationCodeName : '';
    const accessionNumbers = useGenerateAccessionNumbers({ locationPrefix, copies: numberOfCopies! });

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    const handleSave = async () => {
        if (numberOfCopies! < 1) {
            openSnackbar("Please specify a valid number of copies and Location to ensure accession numbers are generated.", "error");
            return;
        }
        setConfirmOpen(true);
    };

    const confirmSave = async () => {
        setConfirmOpen(false);
        try {
            for (let i = 1; i <= numberOfCopies!; i++) {
                const currentAccessionNumber = `${accessionNumbers.join(' ').split(' c.')[0]} c.${i}`;
                // Find the location object that matches the locationCodeName
                const selectedLoc = locations.find(loc => loc.locationCodeName === selectedLocation);
                const bookToSave = {
                    bookId: null,
                    title: bookData?.book_title,
                    accessionNo: currentAccessionNumber,
                    authors: Array.isArray(author)
                        ? author.map((authorName) => ({ name: authorName }))
                        : author
                            ? [{ name: author }]
                            : [],
                    callNumber: callNumber ?? "N/A",
                    purchasePrice: bookData?.purchase_price,
                    status: "Available",
                    section: section || "General",
                    dateAcquired: new Date().toISOString(),
                    categories: Array.isArray(categories)
                        ? categories
                        : categories
                            ? [categories]
                            : [],
                    notes: notes,
                    location: selectedLoc?.locationName,
                    vendor: bookData?.vendor,
                    fundingSource: bookData?.funding_source,
                    subjects: [],
                    thumbnail: "",
                    description: description || "No description available",
                    isbn13: bookData?.isbn,
                    isbn10: isbn10,
                    language: "en",
                    pageCount: 264,
                    publishedDate,
                    publisher: bookData!.publisher,
                    printType: "BOOK",
                    collectionType,
                    bookCondition
                };
                console.log('Saving book copy:', bookToSave);

                await saveBook(bookToSave);
            }

            navigate('/admin/catalog/management/accesion-record', {
                state: {
                    success: true,
                    id: bookData?.id,
                    title: bookData?.book_title,
                },
                replace: true,
            });

        } catch (error) {
            console.error('Error saving book copies:', error);
            openSnackbar(`${title} failed to add to the catalog. Please try again`, "error");
        }
    };

    const handleCancel = () => navigate('/admin/catalog/management/accesion-record');
    const handleCloseConfirm = () => setConfirmOpen(false);
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
                        <Typography variant="h4"><strong>Title:</strong> {bookData?.book_title}</Typography>
                        <Typography variant="h6"><strong>Call Number:</strong> {callNumber}</Typography>
                        <Typography variant="h6"><strong>ISBN:</strong> {isbn}</Typography>
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
                            <>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="ddc-label">Dewey Decimal Classification</InputLabel>
                                    <Select
                                        labelId="ddc-label"
                                        value={ddcNumber}
                                        onChange={(e) => setDDCNumber(e.target.value)}
                                        label="Dewey Decimal Classification"
                                        size="small"
                                    >
                                        {ddcClasses.map((ddc) => (
                                            <MenuItem key={ddc.value} value={ddc.value}>{ddc.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <BookDetailsForm
                                    handleNext={handleNext}
                                    title={title}
                                    setTitle={setTitle}
                                    authors={Array.isArray(author) ? author : [author]}
                                    setAuthors={setAuthor}
                                    publisher={publisher}
                                    setPublisher={setPublisher}
                                    publishedDate={publishedDate}
                                    setPublishedDate={setPublishedDate}
                                    isbn10={isbn10}
                                    setIsbn10={setIsbn10}
                                    isbn13={isbn}
                                    setIsbn13={setIsbn}
                                    desc={description}
                                    setDesc={setDescription}
                                    pageCount={pageCount}
                                    setPageCount={setPageCount}
                                    categories={categories}
                                    setCategories={setCategories}
                                    language={language}
                                    setLanguage={setLanguage}
                                    printType={printType}
                                    setPrintType={setPrintType}
                                />
                            </>

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
                                // setCallNumber={setCallNumber}
                                purchasePrice={purchasePrice}
                                setPurchasePrice={setPurchasePrice}
                                section={section}
                                setSection={setSection}
                                dateAcquired={dateAcquired}
                                setDateAcquired={setDateAcquired}
                                notes={notes}
                                setNotes={setNotes}
                                location={selectedLocation}
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
            <Copyright />

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
        </Box>
    );
};

export default BookFormFast;
