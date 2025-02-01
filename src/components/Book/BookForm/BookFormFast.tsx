import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Chip
} from '@mui/material';
import Sidebar from '../../../components/Sidebar';
import Header from '../../Header/Header';
import MenuIcon from "@mui/icons-material/Menu";
import Copyright from '../../Footer/Copyright';
import useGenerateCallNumber from './useGenerateCallNumber';
import { useGenerateAccessionNumbers } from './useGenerateAccessionNumber';
import { saveBook } from '../../../services/Cataloging/GoogleBooksApi';
import LocationSelect from './LocationSelect';
import { Locations, Sections } from '../../../model/Book';
import SectionSelect from './SectionSelect';
import BookConditionSelect from './BookConditionOptions';


const BookFormFast: React.FC = () => {
    const { state } = useLocation();
    const bookData = state?.bookData;
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isbn] = useState(bookData?.isbn || '');
    const [author, setAuthor] = useState('');
    const [numberOfCopies, setNumberOfCopies] = useState<number | null>(1);
    const [section, setSection] = useState('');
    const [sections, setSections] = useState<Sections[]>([]);
    const [categories, setCategories] = useState('');
    const [description, setDescription] = useState('');
    const [ddcNumber, setDDCNumber] = useState('');
    const [publishedDate, setPublishedDate] = useState('');
    const [locations, setLocations] = useState<Locations[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('');
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

    const callNumber = useGenerateCallNumber({ bookTitle: bookData?.book_title || '', author, ddcNumber, publishedDate: bookData?.published_date });

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
            alert("Number of copies must be at least 1.");
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
                    notes: "",
                    location: selectedLoc?.locationName,
                    vendor: bookData?.vendor,
                    fundingSource: bookData?.funding_source,
                    subjects: [],
                    thumbnail: "",
                    description: description || "No description available",
                    isbn13: bookData?.isbn,
                    isbn10: "",
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
            alert(`An error occurred while saving the book copies. ${error}`);
        }
    };

    const handleCancel = () => navigate('/admin/catalog/management/accesion-record');
    const handleCloseConfirm = () => setConfirmOpen(false);

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

                        <Box component="form" sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Published Date"
                                type="date"
                                value={publishedDate}
                                onChange={(e) => setPublishedDate(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />

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
                            <LocationSelect
                                selectedLocation={selectedLocation}
                                setSelectedLocation={setSelectedLocation}
                                locations={locations}
                                setLocations={setLocations}
                            />

                            <SectionSelect
                                selectedSection={section}
                                setSelectedSection={setSection}
                                sections={sections}
                                setSections={setSections}
                                selectedLocation={selectedLocation}
                                locations={locations}
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
                                label="Categories"
                                value={categories}
                                onChange={(e) => setCategories(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                sx={{ mb: 2 }}
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
