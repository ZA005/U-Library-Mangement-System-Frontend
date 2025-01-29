import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControlLabel,
    Select,
    MenuItem,
    Button,
    Snackbar,
    Alert,
    Container,
    IconButton,
    CircularProgress,
    FormControl,
    InputLabel,
} from '@mui/material';
import { deleteWeedingCriteria, getAllWeedingCriteria, updateWeedingCriteria } from '../../../../services/Cataloging/WeedingCriteriaApi';
import IOSSwitch from '../../../../components/ToggleSwitch/IOSSwitch';
import CriteriaModal from '../../../../components/Modal/CriteriaModal/CriteriaModal';
import ConfirmationDialog from '../../../../components/ConfirmationDialog/ConfirmationDialog';
import { WeedingCriteria } from '../../../../model/Criteria';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import styles from '../styles.module.css';
import Sidebar from '../../../../components/Sidebar';
import Header from '../../../../components/Header/Header';
import Line from '../../../../components/Line/Line';
import Copyright from '../../../../components/Footer/Copyright';

const CriteriaDashboard: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [criteria, setCriteria] = useState<WeedingCriteria[]>([]);
    const [filteredCriteria, setFilteredCriteria] = useState<WeedingCriteria[]>([]);
    const [selectedDdc, setSelectedDdc] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [selectedOption, setSelectedOption] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentToggle, setCurrentToggle] = useState<WeedingCriteria & { additionalMessage?: string } | null>(null);
    const [editingCriteria, setEditingCriteria] = useState<WeedingCriteria | null>(null);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteCriteria, setToDeleteCriteria] = useState<WeedingCriteria | null>(null);
    const [secondaryConfirmationOpen, setSecondaryConfirmationOpen] = useState(false);


    const handleSideBarClick = () => {
        if (!isLoading) setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        if (!isLoading) setSidebarOpen(false);
    };

    useEffect(() => {
        const fetchCriteria = async () => {
            setIsLoading(true);
            try {
                const fetchedCriteria = await getAllWeedingCriteria();
                setCriteria(fetchedCriteria);
                setFilteredCriteria(fetchedCriteria); // Initialize the filtered criteria
            } catch (error) {
                console.error('Failed to fetch weeding criteria:', error);
            } finally {
                setIsLoading(false)
            }
        };

        fetchCriteria();
    }, []);

    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();

    const fetchCriteria = async () => {
        setIsLoading(true);
        try {
            const fetchedCriteria = await getAllWeedingCriteria();
            setCriteria(fetchedCriteria);
        } catch (error) {
            console.error('Failed to fetch weeding criteria:', error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        const handleFilterChange = () => {
            let filtered = [...criteria];

            if (selectedDdc !== 'All') {
                filtered = filtered.filter((item) => item.ddc === selectedDdc);
            }

            if (selectedStatus !== 'All') {
                const isActive = selectedStatus === 'Activated';
                filtered = filtered.filter((item) => item.criteriaStatus === isActive);
            }

            setFilteredCriteria(filtered);
        };

        handleFilterChange();
    }, [selectedDdc, selectedStatus, criteria]);

    const handleOpenModal = (criteriaToEdit?: WeedingCriteria) => {
        setEditingCriteria(criteriaToEdit || null); // Set criteria for editing if provided
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingCriteria(null); // Clear editing state
    };

    const handleToggleSwitch = (item: WeedingCriteria) => {
        setCurrentToggle(item);
        setDialogOpen(true);
    };
    const checkActiveCriteriaForDDC = (ddc: string): boolean => {
        return criteria.some(c => c.ddc === ddc && c.criteriaStatus);
    };

    const handleConfirmToggle = async () => {
        if (!currentToggle) return;

        const { id, ddc, criteriaStatus } = currentToggle;
        try {
            // Check if there's another active criteria for this DDC
            const activeCriteriaExists = checkActiveCriteriaForDDC(ddc);

            if (criteriaStatus === false || !activeCriteriaExists) {
                const updatedCriteria = {
                    ...currentToggle,
                    criteriaStatus: !criteriaStatus
                };
                // Deactivate all criteria for this DDC if activating
                if (!criteriaStatus && activeCriteriaExists) {
                    // Open another confirmation dialog
                    setCurrentToggle({
                        ...currentToggle,
                        additionalMessage: `This will deactivate the current active criteria for DDC ${ddc}.`
                    });
                    setSecondaryConfirmationOpen(true); // Use secondary dialog state
                    return; // Exit this function to wait for the new confirmation
                } else if (!criteriaStatus) {
                    // If no active criteria exist, just activate this one
                    setCriteria(prev =>
                        prev.map(c =>
                            c.ddc === ddc ? { ...c, criteriaStatus: c.id === id } : c
                        )
                    );
                    await Promise.all(criteria.map(async (c: WeedingCriteria) => {
                        if (c.ddc === ddc && c.id !== id) {
                            await updateWeedingCriteria({ ...c, criteriaStatus: false });
                        }
                    }));
                }
                await updateWeedingCriteria(updatedCriteria);

                // Update local state for the current criteria only
                setCriteria((prev) =>
                    prev.map((item) =>
                        item.id === id ? updatedCriteria : item
                    )
                );
                openSnackbar("Criteria updated successfully!", "success");
            } else {
                openSnackbar("There must be exactly one active criteria per DDC.", "error");
            }
        } catch (error) {
            console.error('Failed to update criteria status:', error);
            openSnackbar("Failed to update criteria status!", "error");
        } finally {
            if (!currentToggle?.additionalMessage) {
                setDialogOpen(false);
            }
        }
    };
    const handleSecondaryConfirmation = async () => {
        if (!currentToggle) return;

        const { id, ddc } = currentToggle;
        try {
            // Deactivate all criteria for this DDC
            setCriteria(prev =>
                prev.map(c =>
                    c.ddc === ddc ? { ...c, criteriaStatus: c.id === id } : c
                )
            );
            await Promise.all(criteria.map(async (c: WeedingCriteria) => {
                if (c.ddc === ddc && c.id !== id) {
                    await updateWeedingCriteria({ ...c, criteriaStatus: false });
                }
            }));
            // Now activate the new one
            await updateWeedingCriteria({ ...currentToggle, criteriaStatus: true });

            setCriteria((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, criteriaStatus: true } : item
                )
            );
            openSnackbar("Criteria updated successfully!", "success");
        } catch (error) {
            console.error('Failed to update criteria status:', error);
            openSnackbar("Failed to update criteria status!", "error");
        } finally {
            setSecondaryConfirmationOpen(false);
            setCurrentToggle(prev => prev ? { ...prev, additionalMessage: undefined } : null);
        }
    };

    const handleSelectChange = (value: string, item: WeedingCriteria): void => {
        setSelectedOption(value); // Set the current selected option
        if (value === 'edit') {
            handleOpenModal(item); // Open modal for editing
        } else if (value === 'remove') {
            setToDeleteCriteria(item);
            setDeleteConfirmationOpen(true); // Show delete confirmation dialog
        }
        // Reset after action or when closing modal
        if (value !== '') {
            setTimeout(() => setSelectedOption(''), 100); // Small delay to ensure the action is processed
        }
    };

    const handleConfirmDelete = async () => {
        if (!toDeleteCriteria) return;
        try {
            await deleteWeedingCriteria(toDeleteCriteria.id!);
            setCriteria(prev => prev.filter(c => c.id !== toDeleteCriteria.id));
            openSnackbar("Criteria deleted successfully!", "success");
        } catch (error) {
            console.error('Failed to delete criteria:', error);
            openSnackbar("Failed to delete criteria!", "error");
        } finally {
            setDeleteConfirmationOpen(false);
            setToDeleteCriteria(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false);
        setToDeleteCriteria(null);
    };

    const handleModalConfirm = async (updatedCriteria: WeedingCriteria) => {
        setCriteria(prev => {
            // Deactivate all criteria for the updated DDC
            const deactivated = prev.map(item =>
                item.ddc === updatedCriteria.ddc
                    ? { ...item, criteriaStatus: false }
                    : item
            );

            if (!updatedCriteria.id) {
                // For new criteria, add it to the list as active
                const newCriteriaWithId = { ...updatedCriteria, id: Date.now(), criteriaStatus: true }; // Temporary ID for new criteria, ensure it's active
                return [...deactivated, newCriteriaWithId];
            } else {
                // If it's an edit, update the existing one
                return deactivated.map(item =>
                    item.id === updatedCriteria.id ? updatedCriteria : item
                );
            }
        });
        await fetchCriteria();
        setModalOpen(false);
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
                <Typography variant="h4" gutterBottom className={styles.title}>
                    Criteria Dashboard
                </Typography>
                <Line />
                <Box className={styles.actionBar}>
                    {/* Filters Section */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    <FormControl sx={{ width: '200px' }}> {/* Adjust width here */}
        <InputLabel>Dewey Decimal</InputLabel>
        <Select
            value={selectedDdc}
            onChange={(e) => setSelectedDdc(e.target.value)}
        >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="000">000</MenuItem>
            <MenuItem value="100">100</MenuItem>
            <MenuItem value="200">200</MenuItem>
            <MenuItem value="300">300</MenuItem>
            <MenuItem value="400">400</MenuItem>
            <MenuItem value="500">500</MenuItem>
            <MenuItem value="600">600</MenuItem>
            <MenuItem value="700">700</MenuItem>
            <MenuItem value="800">800</MenuItem>
            <MenuItem value="900">900</MenuItem>
        </Select>
    </FormControl>

    <FormControl sx={{ width: '200px' }}> {/* Adjust width here */}
        <InputLabel>Status</InputLabel>
        <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
        >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Activated">Activated</MenuItem>
            <MenuItem value="Deactivated">Deactivated</MenuItem>
        </Select>
    </FormControl>
</Box>

                    <Button
                        variant="outlined"
                        component="label"
                        onClick={() => handleOpenModal()}
                        disabled={isLoading}
                        startIcon={<AddIcon />}
                    >
                        Create Criteria

                    </Button>
                </Box>
                {isLoading ? (
                    <Box
                        position="fixed" top="0" left="0" width="100%" height="100%"
                        bgcolor="rgba(0, 0, 0, 0.5)" zIndex="1000"
                        display="flex" justifyContent="center" alignItems="center"
                    >
                        <CircularProgress size={60} />
                        <Typography variant="body1" sx={{ color: 'white', marginLeft: 2 }}>
                            Getting data, please wait...
                        </Typography>
                    </Box>
                ) : criteria.length === 0 || filteredCriteria.length === 0 ? (
                    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                        <Typography variant="body1">
                            No criteria have been created yet. Start by clicking the 'Add Criteria' button to add one.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer
                        component={Paper}
                        className={styles.tableContainer}
                        sx={{
                            maxHeight: '70vh',
                            overflowY: 'auto',
                            pointerEvents: isLoading ? 'none' : 'auto'
                        }}
                    >
                        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="criteria table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Dewey Decimal</TableCell>
                                    <TableCell>Min Years Old</TableCell>
                                    <TableCell>Condition Threshold</TableCell>
                                    <TableCell>Usage Threshold</TableCell>
                                    <TableCell>Language</TableCell>
                                    <TableCell>Duplication Check</TableCell>
                                    <TableCell>Criteria Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCriteria.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.ddc}</TableCell>
                                        <TableCell>{item.minYearsOld}</TableCell>
                                        <TableCell>{item.conditionThreshold}</TableCell>
                                        <TableCell>{item.usageThreshold}</TableCell>
                                        <TableCell>{item.language}</TableCell>
                                        <TableCell>{item.duplicationCheck ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                control={
                                                    <IOSSwitch
                                                        sx={{ m: 1 }}
                                                        checked={item.criteriaStatus}
                                                        onChange={() => handleToggleSwitch(item)}
                                                    />
                                                }
                                                label={item.criteriaStatus ? 'Activated' : 'Deactivated'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={selectedOption}
                                                onChange={(e) => handleSelectChange(e.target.value, item)}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>
                                                    Action
                                                </MenuItem>
                                                <MenuItem value="edit">Edit</MenuItem>
                                                <MenuItem value="remove">Remove</MenuItem>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

            </Container>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                <Alert onClose={closeSnackbar} severity={snackbarStatus}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Modal for Adding/Editing Criteria */}
            <CriteriaModal
                open={modalOpen}
                onClose={handleCloseModal}
                onConfirm={handleModalConfirm}
                initialCriteria={editingCriteria!}
                allCriteria={criteria} // Pass the criteria state here
            />

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                open={dialogOpen}
                onClose={() => {
                    setCurrentToggle(prev => prev ? { ...prev, additionalMessage: undefined } : null);
                    setDialogOpen(false);
                }}
                onConfirm={handleConfirmToggle}
                title={currentToggle?.additionalMessage ? "Confirm Criteria Change" : "Confirm Status Change"}
                message={currentToggle?.additionalMessage || `Are you sure you want to ${currentToggle?.criteriaStatus ? 'deactivate' : 'activate'} '${currentToggle?.ddc}' weeding criteria?`}
                confirmText={currentToggle?.criteriaStatus ? 'Deactivate' : (currentToggle?.additionalMessage ? 'Activate New' : 'Activate')}
            />

            {/* Secondary Confirmation Dialog */}
            <ConfirmationDialog
                open={secondaryConfirmationOpen}
                onClose={() => {
                    setSecondaryConfirmationOpen(false);
                    setCurrentToggle(prev => prev ? { ...prev, additionalMessage: undefined } : null);
                }}
                onConfirm={handleSecondaryConfirmation}
                title="Confirm Criteria Change"
                message={`Are you sure you want to deactivate the current active criteria for DDC ${currentToggle?.ddc} and activate this one?`}
                confirmText="Confirm"
            />

            {/* Confirmation Dialog for Deletion */}
            <ConfirmationDialog
                open={deleteConfirmationOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to delete the criteria for DDC ${toDeleteCriteria?.ddc}?`}
                confirmText="Delete"
            />
            <Copyright />
        </Box >
    );
};

export default CriteriaDashboard;
