import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, IconButton, Container, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllBookWeeding, manualBookWeedFlagging, toUpdateWeedingProcess, toWeedBook } from '../../../../services/Cataloging/BookWeeding';
import styles from '../styles.module.css';
import Sidebar from '../../../../components/Sidebar';
import Header from '../../../../components/Header/Header';
import MenuIcon from '@mui/icons-material/Menu';
import { WeedInfos } from '../../../../model/Criteria';
import ReviewModal from '../../../../components/Modal/WeedingModal/ReviewModal';
import UserService from '../../../../services/UserService';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import ConfirmationDialog from '../../../../components/ConfirmationDialog/ConfirmationDialog';
import Line from '../../../../components/Line/Line';

const WeedingDashboard: React.FC = () => {
    const [filter, setFilter] = useState<{ criteria?: string, accessionNo?: string, status: string }>({
        status: 'FLAGGED'
    });
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [weedInfos, setWeedInfos] = useState<WeedInfos[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [currentWeedInfo, setCurrentWeedInfo] = useState<WeedInfos | null>(null);
    const [isOverride, setIsOverride] = useState<boolean>(false)
    const [isArchiving, setIsArchiving] = useState<boolean>(false)
    const [processNotes, setProcessNotes] = useState<string>('');
    const [allProcessed, setAllProcessed] = useState<boolean>(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const navigate = useNavigate();

    const handleOpenModal = (weedInfo: WeedInfos, override = false) => {
        setCurrentWeedInfo(weedInfo);
        setIsOverride(override);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsOverride(false); // Reset override state when closing modal
    };

    const handleSideBarClick = () => {
        if (!isLoading) setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        if (!isLoading) setSidebarOpen(false);
    };
    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();

    useEffect(() => {
        const fetchBooksFlaggedToWeed = async () => {
            setIsLoading(true);
            try {
                const fetchedBooksFlaggedToWeed = await getAllBookWeeding();
                setWeedInfos(fetchedBooksFlaggedToWeed);

                // Check if the user is an admin and update the filter status
                if (UserService.isAdmin()) {
                    setFilter((prevFilter) => ({
                        ...prevFilter,
                        status: 'REVIEWED',
                    }));
                }
                openSnackbar("Fetched data successfully", "success");
            } catch (error) {
                console.error('Failed to fetch All Books weeding data: ', error);
                openSnackbar("There was an error fetching data", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooksFlaggedToWeed();
    }, [openSnackbar])

    const handleFilterChange = (field: keyof typeof filter, value: string) => {
        setFilter(prev => ({ ...prev, [field]: value }));
    };

    const handleManualWeeding = async () => {
        try {
            await manualBookWeedFlagging();
            openSnackbar("Weeding process has been manually triggered.", "success");
        } catch (error) {
            console.error('Error triggering manual weeding:', error);
            openSnackbar("Failed to trigger manual weeding process.", "error");
        }
    };

    const handleWeedBook = async (bookWeedingStatusNotes: string) => {
        if (currentWeedInfo) {
            try {
                const isAdmin = UserService.isAdmin();
                let updatedStatus = isOverride ? "KEPT" : (isAdmin ? "WEEDED" : "REVIEWED");
                if (isArchiving) {
                    updatedStatus = "ARCHIVED";
                }

                let notesToUse = (isOverride || !currentWeedInfo.bookWeedingStatusNotes)
                    ? bookWeedingStatusNotes
                    : currentWeedInfo.bookWeedingStatusNotes;

                if (!isOverride && (!notesToUse || notesToUse === "")) {
                    notesToUse = bookWeedingStatusNotes;
                }

                // Update in the database or perform the async operation
                await toWeedBook({
                    ...currentWeedInfo,
                    bookWeedingStatusNotes: notesToUse,
                    reviewDate: new Date(),
                    weedStatus: updatedStatus
                });

                openSnackbar("Book status updated.", "success");


                setWeedInfos(prev => prev.map(book =>
                    book.id === currentWeedInfo.id ? {
                        ...book,
                        weedStatus: updatedStatus,
                        bookWeedingStatusNotes: notesToUse,
                        reviewDate: new Date()
                    } : book
                ));
                // Then update currentWeedInfo directly
                setCurrentWeedInfo(prev => {
                    if (!prev) return prev; // Handle null prev state case safely

                    return {
                        ...prev,
                        weedStatus: updatedStatus,
                        bookWeedingStatusNotes: notesToUse,
                        reviewDate: new Date()
                    };
                });

                // Check if this was the last book in the process to be updated
                const processBooks = weedInfos.filter(book => book.weedProcessId === currentWeedInfo.weedProcessId);
                const allProcessed = processBooks.every(book => book.weedStatus !== 'FLAGGED');

                // Handle the logic for allProcessed and the modal opening
                if (allProcessed && isAdmin) {
                    if (updatedStatus === "WEEDED") {
                        // If the last action was weeding, open the archiving confirmation
                        setAllProcessed(false);
                        setProcessNotes('');
                        setConfirmationOpen(true); // Open confirmation dialog for archiving
                    } else {
                        // If not weeding (override or reviewed), proceed directly to process completion
                        setAllProcessed(true);
                        setProcessNotes('');
                        handleCloseModal();
                        setOpenModal(true); // Open modal for process completion
                    }
                } else {
                    handleCloseModal();
                }
            } catch (error) {
                console.error('Error updating book status:', error);
                openSnackbar("Failed to update the book status.", "error");
                handleCloseModal();
            }
        }
    };

    const handleArchiving = async (shouldArchive: boolean) => {
        if (currentWeedInfo) {
            try {
                if (shouldArchive) {
                    // Reopen ReviewModal for archiving
                    setIsArchiving(true);
                    setOpenModal(true);
                    setConfirmationOpen(false);
                    console.log("YES!!!")
                } else {
                    // Directly set to WEEDED without reopening modal
                    const updatedWeedInfo = {
                        ...currentWeedInfo,
                        bookWeedingStatusNotes: currentWeedInfo.bookWeedingStatusNotes || '',
                        reviewDate: new Date(),
                        weedStatus: "WEEDED"
                    };

                    await toWeedBook(updatedWeedInfo);

                    // Update currentWeedInfo after processing
                    setCurrentWeedInfo(updatedWeedInfo); // Assuming setCurrentWeedInfo is a state setter function

                    openSnackbar("Book has been weeded.", "success");
                    setConfirmationOpen(false);
                    console.log("NO!!!")
                    // Check if all books are processed for this weedProcessId
                    checkAllProcessed();
                }
                checkAllProcessed();
            } catch (error) {
                console.error('Error handling archiving:', error);
                openSnackbar("Failed to update book status.", "error");
                setConfirmationOpen(false); // Make sure to close dialog on error
            }
        }
    };

    const checkAllProcessed = () => {
        if (currentWeedInfo) {
            const processBooks = weedInfos.filter(book => book.weedProcessId === currentWeedInfo.weedProcessId);
            const allProcessed = processBooks.every(book => !['FLAGGED', 'REVIEWED'].includes(book.weedStatus));

            setAllProcessed(allProcessed);
            if (allProcessed && UserService.isAdmin()) {
                setProcessNotes('');
                setOpenModal(true); // Open modal for finalizing process if all books are processed
            } else {
                handleCloseModal(); // Close modal if not all processed
            }
        }
    };
    const finalizeArchiving = async (bookWeedingStatusNotes: string) => {
        if (currentWeedInfo) {
            try {
                await toWeedBook({
                    ...currentWeedInfo,
                    bookWeedingStatusNotes: bookWeedingStatusNotes,
                    reviewDate: new Date(),
                    weedStatus: "ARCHIVED"
                });
                openSnackbar("Book has been archived.", "success");

                // Check if all books in the process are now processed
                const processBooks = weedInfos.filter(book => book.weedProcessId === currentWeedInfo.weedProcessId);
                const allProcessed = processBooks.every(book => book.weedStatus !== 'FLAGGED');
                if (allProcessed && UserService.isAdmin()) {
                    setAllProcessed(true); // Set to true for process completion
                    setProcessNotes('');
                    handleCloseModal(); // Close the current modal
                    setOpenModal(true); // Reopen modal for process completion
                } else {

                    handleCloseModal();
                }
            } catch (error) {
                console.error('Error archiving book:', error);
                openSnackbar("Failed to archive book.", "error");
            } finally {
                setIsArchiving(false); // Reset isArchiving state
            }
        }
    };
    const finalizeProcess = async () => {
        if (currentWeedInfo) {
            try {
                const updatedProcessInfo = {
                    processEndDate: new Date(),
                    processNotes: processNotes,
                    processStatus: "COMPLETED"
                };

                // Find the latest info from the state
                const updatedWeedInfo = weedInfos.find(book => book.id === currentWeedInfo.id);

                if (updatedWeedInfo) {
                    // Use the updated info from the state
                    const infoWithProcessData = {
                        ...updatedWeedInfo,
                        ...updatedProcessInfo
                    };

                    // Update the process on the server
                    await toUpdateWeedingProcess(infoWithProcessData);

                    // Update local state
                    setWeedInfos(prev => {
                        return prev.map(book =>
                            book.weedProcessId === currentWeedInfo.weedProcessId
                                ? { ...book, ...updatedProcessInfo }
                                : book
                        );
                    });
                    openSnackbar("Weeding process finalized.", "success");
                } else {
                    console.error('Could not find updated book info for finalizing process.');
                }
            } catch (error) {
                console.error('Error finalizing process:', error);
                openSnackbar("Failed to finalize the process.", "error");
            } finally {
                handleCloseModal();
                setAllProcessed(false); // Reset to allow for another process to be finalized
            }
        }
    };

    const onOverrideWeeding = async (bookId: number) => {
        const bookToOverride = weedInfos.find(book => book.id === bookId);
        setIsOverride(true); // This schedules the update
        if (bookToOverride) {
            handleOpenModal(bookToOverride, true); // Here, `true` directly influences the modal state, not `isOverride`
        } else {
            console.error('Book not found for overriding');
        }
    };

    const statusToDisplay = (status: string) => {
        switch (status) {
            case 'REVIEWED':
                return { text: 'Reviewed', color: '#3f51b5' }; // Indigo
            case 'KEPT':
                return { text: 'Kept', color: '#4caf50' }; // Green
            case 'WEEDED':
                return { text: 'Weeded', color: '#f44336' }; // Red
            case 'ARCHIVED':
                return { text: 'Archived', color: '#795548' }; // Brown
            default:
                return null;
        }
    };


    // Group and filter weedInfos by weedProcessId and apply filters
    const filteredGroupedWeedInfos = weedInfos.reduce((acc, weedInfo) => {
        if (
            (!filter.criteria || weedInfo.weedingCriteriaDdc.toLowerCase().includes(filter.criteria.toLowerCase())) &&
            (!filter.accessionNo || weedInfo.accessionNo.includes(filter.accessionNo)) &&
            (!filter.status || weedInfo.weedStatus === filter.status)
        ) {
            if (!acc[weedInfo.weedProcessId]) {
                acc[weedInfo.weedProcessId] = {
                    books: [],
                    processStartDate: weedInfo.processStartDate
                };
            }
            acc[weedInfo.weedProcessId].books.push(weedInfo);
        }
        return acc;
    }, {} as { [key: number]: { books: WeedInfos[]; processStartDate: Date } });

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const renderActionBasedOnStatus = (weedInfo: WeedInfos) => {
        const isAdmin = UserService.isAdmin();

        if (statusToDisplay(weedInfo.weedStatus)) {
            if (weedInfo.weedStatus === 'REVIEWED' && isAdmin) {
                return (
                    <>
                        <Button color="error" variant="contained" size="small" onClick={() => handleOpenModal(weedInfo)}>Weed</Button>
                        <Button onClick={() => onOverrideWeeding(weedInfo.id)} variant="outlined" size="small" sx={{ ml: 1 }}>Override</Button>
                    </>
                );
            }
            return <Typography color={statusToDisplay(weedInfo.weedStatus)?.color}>
                {statusToDisplay(weedInfo.weedStatus)?.text}
            </Typography>;
        } else if (weedInfo.weedStatus === 'FLAGGED') {
            return (
                <>
                    <Button color="error" variant="contained" size="small" onClick={() => handleOpenModal(weedInfo)}>Weed</Button>
                    <Button onClick={() => onOverrideWeeding(weedInfo.id)} variant="outlined" size="small" sx={{ ml: 1 }}>Override</Button>
                </>
            );
        }
        return null;
    };

    return (
        <Box className={styles.rootContainer}>
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" className={styles.container}>
                <Header
                    buttons={
                        <IconButton onClick={handleSideBarClick} disabled={isLoading}>
                            <MenuIcon className={styles.menuIcon} />
                        </IconButton>
                    }
                />
                <Typography variant="h4" gutterBottom>Book Weeding Dashboard</Typography>
                <Line />




                {/* Filters */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Criteria"
                            value={filter.criteria || ''}
                            onChange={(e) => handleFilterChange('criteria', e.target.value)}
                            variant="outlined"
                        />
                        <TextField
                            label="Accession number"
                            value={filter.accessionNo || ''}
                            onChange={(e) => handleFilterChange('accessionNo', e.target.value)}
                            variant="outlined"
                        />
                        <Select
                            value={filter.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value as string)}
                            displayEmpty
                            variant="outlined"
                        >
                            <MenuItem value="">All Status</MenuItem>
                            <MenuItem value="FLAGGED">FLAGGED</MenuItem>
                            <MenuItem value="REVIEWED">REVIEWED</MenuItem>
                            <MenuItem value="KEPT">KEPT</MenuItem>
                            <MenuItem value="WEEDED">WEEDED</MenuItem>
                            <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="text"
                            sx={{
                                color: "#EA4040",
                                textTransform: "none",
                                ":hover": {
                                    backgroundColor: "#f2f2f2",
                                    color: "#d13333",
                                },
                            }}
                            onClick={() => navigate('/admin/catalog/management/criteria')}
                        >
                            View Criteria
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleManualWeeding}
                        >
                            Initiate Book Weeding Process
                        </Button>
                    </Box>
                </Box>

                {/* Weeding Table */}
                <TableContainer
                    component={Paper}
                    className={styles.tableContainer}
                    sx={{
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        pointerEvents: isLoading ? 'none' : 'auto'
                    }}
                >
                    <Table sx={{ minWidth: 650 }} aria-label="book weeding table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Accession #</TableCell>
                                <TableCell>Call Number</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Weeding Criteria</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(filteredGroupedWeedInfos).map(([processId, { books, processStartDate }]) => (
                                <React.Fragment key={processId}>
                                    <TableRow>
                                        <TableCell colSpan={4} style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                            Weeding Process ID: {processId}
                                        </TableCell>
                                        <TableCell colSpan={2} style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', textAlign: 'right' }}>
                                            Date Initiated: {formatDate(processStartDate)}
                                        </TableCell>
                                    </TableRow>
                                    {books.map((weedInfo) => (
                                        <TableRow key={weedInfo.id}>
                                            <TableCell>{weedInfo.accessionNo}</TableCell>
                                            <TableCell>{weedInfo.callNumber}</TableCell>
                                            <TableCell>{weedInfo.bookTitle}</TableCell>
                                            <TableCell>{weedInfo.authors}</TableCell>
                                            <TableCell>{weedInfo.weedingCriteriaDdc}</TableCell>
                                            <TableCell>
                                                {renderActionBasedOnStatus(weedInfo)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            {currentWeedInfo && (
                <ReviewModal
                    open={openModal}
                    handleClose={handleCloseModal}
                    onConfirm={isArchiving ? finalizeArchiving : (allProcessed ? finalizeProcess : handleWeedBook)}
                    weedInfo={currentWeedInfo}
                    isOverride={isOverride}
                    processNotes={processNotes}
                    setProcessNotes={setProcessNotes}
                    isFinalizingProcess={allProcessed}
                    isArchiving={isArchiving}
                />
            )}
            <ConfirmationDialog
                open={confirmationOpen}
                onClose={() => {
                    setConfirmationOpen(false); // Close the confirmation dialog
                    setIsArchiving(false); // Set isArchiving to false
                    checkAllProcessed();
                }}

                onConfirm={() => handleArchiving(true)}
                title="Confirm Action"
                message="Do you want to archive this book?"
                confirmText="Yes, Archive"
                cancelText="No, Weed"
            />

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                <Alert onClose={closeSnackbar} severity={snackbarStatus}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default WeedingDashboard;