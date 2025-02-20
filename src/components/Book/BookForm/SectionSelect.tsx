import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip, Alert, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { addSection, getAllSections, deleteSection } from '../../../services/Cataloging/LocalBooksAPI'; // Assuming these functions exist
import ModalForm from '../../Modal/ModalForm';
import { Locations, Sections } from '../../../model/Book';
import { useSnackbar } from '../../../hooks/useSnackbar';

interface SectionSelectProps {
    selectedSection: string;
    setSelectedSection: (section: string) => void;
    sections: Sections[];
    setSections: (sections: Sections[]) => void;
    selectedLocation: string;
    locations: Locations[];
}

const SectionSelect: React.FC<SectionSelectProps> = ({
    selectedSection,
    setSelectedSection,
    sections,
    setSections,
    selectedLocation,
    locations
}) => {

    const [showSectionModal, setShowSectionModal] = React.useState(false);
    const [newSectionName, setNewSectionName] = React.useState('');

    React.useEffect(() => {
        const fetchSections = async () => {
            try {
                const locationId = locations.find(loc => loc.locationCodeName === selectedLocation)?.id || null;
                if (locationId !== null) {
                    const fetchedSections = await getAllSections(locationId);
                    setSections(fetchedSections);
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        };

        if (selectedLocation) {
            fetchSections();
        }
    }, [setSections, locations, selectedLocation]);

    const handleAddNewSection = () => {
        setShowSectionModal(true);
    };

    const handleSectionModalClose = () => {
        setShowSectionModal(false);
        setNewSectionName('');
    };

    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();



    const handleSectionModalConfirm = async () => {
        if (newSectionName && selectedLocation) {
            try {
                const locationId = locations.find(loc => loc.locationCodeName === selectedLocation)?.id;
                if (!locationId) throw new Error('Location not found');

                const newSection = {
                    sectionName: newSectionName,
                    locationId: locationId
                };

                const addedSection = await addSection(newSection);
                setSections([...sections, addedSection]);
                setSelectedSection(addedSection.sectionName);
                setShowSectionModal(false);
                setNewSectionName('');
                // console.log('New section added:', addedSection);
                openSnackbar("New section added", "success");
            } catch (error) {
                console.error('Failed to add new section:', error);
                // alert('Failed to add new section. Please try again.');
                openSnackbar("Failed to add new section. Please try again.", "error");
            }
        }
    };

    const handleDeleteSection = async (id: number) => {
        try {
            await deleteSection(id);
            setSections(sections.filter(section => section.id !== id));
            if (selectedSection === sections.find(section => section.id === id)?.sectionName) {
                setSelectedSection('');
                openSnackbar("Section deleted", "success");
            } else {
                if (!sections.some(section => section.sectionName === selectedSection)) {
                    setSelectedSection('');
                }
            }
        } catch (error) {
            console.error('Failed to delete section:', error);
            openSnackbar("Failed to delete section", "error");
            // alert('Failed to delete section. Please try again.');
        }
    };

    return (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="section-label">
                {selectedLocation ? "Section" : "Select a location first"}
            </InputLabel>
            <Select
                labelId="section-label"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                label="Section"
                size="small"
                disabled={!selectedLocation} // Disable if no location is selected
            >
                <MenuItem value="">Select</MenuItem>
                {sections.map((section) => (
                    <MenuItem
                        key={section.id}
                        value={section.sectionName}
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <span>{section.sectionName}</span>
                        {selectedSection !== section.sectionName && (
                            <Tooltip title="Remove Section" placement="right">
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSection(section.id!);
                                    }}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </MenuItem>
                ))}
                <MenuItem onClick={handleAddNewSection} value="" disabled={!selectedLocation}>Add a Section</MenuItem>
            </Select>
            {/* ModalForm component */}
            <ModalForm
                open={showSectionModal}
                handleClose={handleSectionModalClose}
                title="Add New Section"
                fields={[
                    {
                        label: "Section Name",
                        type: "text",
                        value: newSectionName,
                        onChange: (value: string) => setNewSectionName(value),
                        required: true,
                    }
                ]}
                onConfirm={handleSectionModalConfirm}
                confirmText="Add Section"
            />
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                <Alert onClose={closeSnackbar} severity={snackbarStatus}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </FormControl>
    );
};

export default SectionSelect;