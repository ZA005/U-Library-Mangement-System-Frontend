import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip, Alert, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Locations } from '../../../model/Book';
import { addLibrary, getAllLibraries, deleteLocation } from '../../../services/Cataloging/LocalBooksAPI';
import ModalForm from '../../Modal/ModalForm';
import { useSnackbar } from '../../../hooks/useSnackbar';

interface LocationSelectProps {
    selectedLocation: string;
    setSelectedLocation: (location: string) => void;
    locations: Locations[];
    setLocations: (locations: Locations[]) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
    selectedLocation,
    setSelectedLocation,
    locations,
    setLocations
}) => {

    const [showLocationModal, setShowLocationModal] = React.useState(false);
    const [newLibraryCodeName, setNewLibraryCodeName] = React.useState('');
    const [newLibraryName, setNewLibraryName] = React.useState('');

    React.useEffect(() => {
        const fetchLocations = async () => {
            try {
                const fetchedLocations = await getAllLibraries();
                setLocations(fetchedLocations);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
    }, [setLocations]);

    const handleAddNewLocation = () => {
        setShowLocationModal(true);
    };

    const handleLocationModalClose = () => {
        setShowLocationModal(false);
        setNewLibraryCodeName('');
        setNewLibraryName('');
    };

    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();

    const handleLocationModalConfirm = async () => {
        if (newLibraryCodeName && newLibraryName) {
            try {
                const newLocation = {
                    locationCodeName: newLibraryCodeName,
                    locationName: newLibraryName
                };

                const addedLocation = await addLibrary(newLocation);
                setLocations([...locations, addedLocation]);
                setSelectedLocation(addedLocation.locationCodeName);
                setShowLocationModal(false);
                setNewLibraryCodeName('');
                setNewLibraryName('');
                // console.log('New location added:', addedLocation);
                openSnackbar("New Library added", "success");
            } catch (error) {
                console.error('Failed to add new location:', error);
                alert('Failed to add new location. Please try again.');
                openSnackbar("Failed to add new location. Please try again.", "error");
            }
        }
    };

    const handleDeleteLocation = async (id: number) => {
        try {
            await deleteLocation(id);
            setLocations(locations.filter(loc => loc.id !== id));
            if (selectedLocation === locations.find(loc => loc.id === id)?.locationCodeName) {
                setSelectedLocation('');
            } else {
                if (!locations.some(loc => loc.locationCodeName === selectedLocation)) {
                    setSelectedLocation('');
                }
            }
        } catch (error) {
            console.error('Failed to delete location:', error);
            alert('Failed to delete location. Please try again.');
        }
    };
    return (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="location-label">Library</InputLabel>
            <Select
                labelId="location-label"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                label="Location"
                placeholder='Please select a library'
                size="small"
            >
                <MenuItem value="">Select</MenuItem>
                {locations.map((loc) => (
                    <MenuItem
                        key={loc.id}
                        value={loc.locationCodeName}
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <span>{loc.locationName}</span>
                        {selectedLocation !== loc.locationCodeName && (
                            <Tooltip title="Remove Library" placement="right">
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents the menu from closing
                                        handleDeleteLocation(loc.id!);
                                    }}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </MenuItem>
                ))}
                <MenuItem onClick={handleAddNewLocation} value="">Add a Library</MenuItem>
            </Select>
            <ModalForm
                open={showLocationModal}
                handleClose={handleLocationModalClose}
                title="Add New Library"
                fields={[
                    {
                        label: "Library Code Name",
                        type: "text",
                        value: newLibraryCodeName,
                        onChange: (value: string) => setNewLibraryCodeName(value),
                        required: true,
                    },
                    {
                        label: "Library Name",
                        type: "text",
                        value: newLibraryName,
                        onChange: (value: string) => setNewLibraryName(value),
                        required: true,
                    }
                ]}
                onConfirm={handleLocationModalConfirm}
                confirmText="Add Library"
            />

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                <Alert onClose={closeSnackbar} severity={snackbarStatus}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </FormControl>
    );
};

export default LocationSelect;
