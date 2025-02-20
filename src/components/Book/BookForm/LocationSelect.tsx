import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel, Alert, Snackbar } from '@mui/material';
import { Locations } from '../../../model/Book';
import { addLibrary, getAllLibraries, updateLocationStatus } from '../../../services/Cataloging/LocalBooksAPI';
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
                    locationName: newLibraryName,
                    status: true  // New locations start as active
                };

                const addedLocation = await addLibrary(newLocation);
                setLocations([...locations, addedLocation]);
                setSelectedLocation(addedLocation.locationCodeName);
                setShowLocationModal(false);
                setNewLibraryCodeName('');
                setNewLibraryName('');
                openSnackbar("New Location added", "success");
            } catch (error) {
                console.error('Failed to add new location:', error);
                alert('Failed to add new location. Please try again.');
                openSnackbar("Failed to add new location. Please try again.", "error");
            }
        }
    };

    const handleSwitchChange = async (id: number, status: boolean) => {
        try {
            const updatedLocation = await updateLocationStatus(id, !status);
            setLocations(locations.map(loc =>
                loc.id === id ? { ...loc, status: !status } : loc
            ));
            // If the location becomes inactive, deselect it
            if (!status && selectedLocation === locations.find(loc => loc.id === id)?.locationCodeName) {
                setSelectedLocation('');
            }
        } catch (error) {
            console.error('Failed to update location status:', error);
            alert('Failed to update location status. Please try again.');
        }
    };

    return (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="location-label">Location</InputLabel>
            <Select
                labelId="location-label"
                value={selectedLocation}
                onChange={(e) => {
                    const selectedLoc = locations.find(loc => loc.locationCodeName === e.target.value);

                    if (selectedLoc) {
                        if (!selectedLoc.status) {
                            // Notify the user and close the dropdown
                            openSnackbar("This location is inactive and cannot be selected.", "warning");
                        } else {
                            setSelectedLocation(e.target.value);
                        }
                    }
                }}
                onClose={() => { }}
                label="Location"
                placeholder='Please select a location'
                size="small"
                required
            >
                <MenuItem value="">Select</MenuItem>
                {locations.map((loc) => (
                    <MenuItem
                        key={loc.id}
                        value={loc.locationCodeName}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            opacity: loc.status ? 1 : 0.5,
                            paddingRight: '40px'
                        }}
                        onClick={() => {
                            if (!loc.status) {
                                openSnackbar("This location is inactive and cannot be selected.", "warning");
                            }
                        }}
                    >
                        <span>{loc.locationName}</span>

                        {selectedLocation !== loc.locationCodeName && (
                            <div
                                style={{ marginLeft: 'auto' }}
                                onClick={(event) => event.stopPropagation()}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={loc.status}
                                            onChange={() => handleSwitchChange(loc.id!, loc.status)}
                                            color="primary"
                                        />
                                    }
                                    label={loc.status ? "Active" : "Inactive"}
                                    labelPlacement="start"
                                />
                            </div>
                        )}
                    </MenuItem>
                ))}
                <MenuItem onClick={handleAddNewLocation} value="">Add Location</MenuItem>
            </Select>
            <ModalForm
                open={showLocationModal}
                handleClose={handleLocationModalClose}
                title="Add New Location"
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
                confirmText="Add Location"
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