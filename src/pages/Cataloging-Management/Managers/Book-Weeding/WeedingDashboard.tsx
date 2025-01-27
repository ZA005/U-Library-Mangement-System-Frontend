/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, IconButton, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllBookWeeding, manualBookWeedFlagging, toWeedBook } from '../../../../services/Cataloging/BookWeeding';
import styles from '../styles.module.css';
import Sidebar from '../../../../components/Sidebar';
import Header from '../../../../components/Header/Header';
import MenuIcon from '@mui/icons-material/Menu';
import { WeedInfos } from '../../../../model/Criteria';
import ReviewModal from '../../../../components/Modal/CriteriaModal/ReviewModal';


interface WeedingDashboardProps {
    // onWeedBook: (bookId: string) => void;
    onOverrideWeeding: (bookId: string, reason?: string) => void;
    onFilterChange: (filter: { ddc?: string, age?: number, condition?: string }) => void;
}


const WeedingDashboard: React.FC<WeedingDashboardProps> = ({ onOverrideWeeding }) => {
    const [filter, setFilter] = useState<{ ddc?: string, age?: number, condition?: string }>({});
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [weedInfos, setWeedInfos] = useState<WeedInfos[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [currentWeedInfo, setCurrentWeedInfo] = useState<WeedInfos | null>(null);
    const navigate = useNavigate();

    const handleOpenModal = (weedInfo: WeedInfos) => {
        setCurrentWeedInfo(weedInfo);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        const fetchBooksFlaggedToWeed = async () => {
            setIsLoading(true);
            try {
                const fetchedBooksFlaggedToWeed = await getAllBookWeeding();
                setWeedInfos(fetchedBooksFlaggedToWeed);
                setFilter(fetchedBooksFlaggedToWeed);
            } catch (error) {
                console.error('Failed to fetch All Books weeding data: ', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooksFlaggedToWeed();
    }, []);

    const handleFilterChange = (field: keyof typeof filter, value: string | number) => {
        setFilter(prev => ({ ...prev, [field]: value }));
    };
    const handleManualWeeding = async () => {
        try {
            await manualBookWeedFlagging();
            alert('Weeding process has been manually triggered.');
        } catch (error) {
            console.error('Error triggering manual weeding:', error);
            alert('Failed to trigger manual weeding process.');
        }
    };

    const handleSideBarClick = () => {
        if (!isLoading) setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        if (!isLoading) setSidebarOpen(false);
    };

    const handleWeedBook = async (bookWeedingStatusNotes: string) => {
        if (currentWeedInfo) {
            try {
                await toWeedBook({
                    ...currentWeedInfo,
                    bookWeedingStatusNotes: bookWeedingStatusNotes,
                    reviewDate: new Date(),
                    weedStatus: "REVIEWED"

                });
                alert('Book weeded with selected reasons.');
                setWeedInfos(prev => prev.filter(book => book.id !== currentWeedInfo.bookId));
            } catch (error) {
                console.error('Error weeding book:', error);
                alert('Failed to weed the book.');
            } finally {
                handleCloseModal();
            }
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
                    sx={{ mb: 2 }}
                >
                    Trigger Book Weeding
                </Button>
                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                        label="Dewey Decimal"
                        value={filter.ddc || ''}
                        onChange={(e) => handleFilterChange('ddc', e.target.value)}
                        variant="outlined"
                    />
                    <TextField
                        type="number"
                        label="Age (Years)"
                        value={filter.age || ''}
                        onChange={(e) => handleFilterChange('age', Number(e.target.value))}
                        variant="outlined"
                    />
                    <Select
                        value={filter.condition || ''}
                        onChange={(e) => handleFilterChange('condition', e.target.value as string)}
                        displayEmpty
                        variant="outlined"
                    >
                        <MenuItem value="">All Conditions</MenuItem>
                        <MenuItem value="poor">Poor</MenuItem>
                        <MenuItem value="fair">Fair</MenuItem>
                        <MenuItem value="good">Good</MenuItem>
                        <MenuItem value="excellent">Excellent</MenuItem>
                    </Select>
                </Box>

                {/* Book Table */}
                <TableContainer
                    component={Paper}
                    className={styles.tableContainer}
                    sx={{
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        // pointerEvents: isLoading ? 'none' : 'auto'
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
                            {weedInfos.map((weedInfo: any) => (
                                <TableRow key={weedInfo.id}>
                                    <TableCell component="th" scope="row">
                                        {weedInfo.accessionNo}
                                    </TableCell>
                                    <TableCell>{weedInfo.callNumber}</TableCell>
                                    <TableCell>{weedInfo.bookTitle}</TableCell>
                                    <TableCell>{weedInfo.authors}</TableCell>
                                    <TableCell>{weedInfo.weedingCriteriaDdc}</TableCell>
                                    <TableCell>
                                        {statusToDisplay(weedInfo.weedStatus) ?
                                            <Typography color={statusToDisplay(weedInfo.weedStatus)?.color}>
                                                {statusToDisplay(weedInfo.weedStatus)?.text}
                                            </Typography>
                                            :
                                            <>
                                                {weedInfo.weedStatus === 'FLAGGED' && (
                                                    <>
                                                        <Button color="error" variant="contained" size="small" onClick={() => handleOpenModal(weedInfo)}>Weed</Button>
                                                        <Button onClick={() => onOverrideWeeding(weedInfo.id)} variant="outlined" size="small" sx={{ ml: 1 }}>Override</Button>
                                                    </>
                                                )}
                                            </>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ReviewModal
                    open={openModal}
                    handleClose={handleCloseModal}
                    onConfirm={handleWeedBook}
                />
            </Container>
        </Box>
    );
};

export default WeedingDashboard;
