import React from "react";
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import LocationSelect from "./LocationSelect";
import SectionSelect from "./SectionSelect";
import BookConditionSelect from "./BookConditionOptions";
import { Locations, Sections } from "../../../model/Book";

interface BookMetadataFormProps {
    status: string;
    setStatus: (value: string) => void;
    numberOfCopies: number | null;
    setNumberOfCopies: (value: number | null) => void;
    callNumber: string;
    setCallNumber?: (value: string) => void;
    purchasePrice: string;
    setPurchasePrice: (value: string) => void;
    location: string;
    setSelectedLocation: (value: string) => void;
    locations: Locations[];
    setLocations: (value: Locations[]) => void;
    section: string;
    setSection: (value: string) => void;
    sections: Sections[];
    setSections: (value: Sections[]) => void;
    dateAcquired: string;
    setDateAcquired: (value: string) => void;
    notes: string;
    setNotes: (value: string) => void;
    vendor: string;
    setVendor: (value: string) => void;
    fundingSource: string;
    setFundingSource: (value: string) => void;
    bookCondition: string;
    setBookCondition: React.Dispatch<React.SetStateAction<string>>;
    collectionType: string;
    setCollectionType: (value: string) => void;
    subjects: string;
    setSubjects: (value: string) => void;
    handleBack: () => void;
    handleCancel: () => void;
    handleSave: () => void;
}

const BookMetadataForm: React.FC<BookMetadataFormProps> = ({
    status,
    setStatus,
    numberOfCopies,
    setNumberOfCopies,
    callNumber,
    setCallNumber,
    purchasePrice,
    setPurchasePrice,
    location,
    setSelectedLocation,
    locations,
    setLocations,
    section,
    setSection,
    sections,
    setSections,
    dateAcquired,
    setDateAcquired,
    notes,
    setNotes,
    vendor,
    setVendor,
    fundingSource,
    setFundingSource,
    bookCondition,
    setBookCondition,
    collectionType,
    setCollectionType,
    subjects,
    setSubjects,
    handleBack,
    handleCancel,
    handleSave
}) => {
    return (
        <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value as string)} label="Status" size="small">
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
                onChange={(e) => setNumberOfCopies(e.target.value ? Number(e.target.value) : null)}
                sx={{ mb: 2 }}
                size="small"
            />


            <TextField fullWidth label="Call Number" value={callNumber} onChange={(e) => setCallNumber && setCallNumber(e.target.value)} sx={{ mb: 2 }} size="small" />

            <TextField fullWidth label="Purchase Price" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} sx={{ mb: 2 }} size="small" />

            <LocationSelect selectedLocation={location} setSelectedLocation={setSelectedLocation} locations={locations} setLocations={setLocations} />

            <SectionSelect selectedSection={section} setSelectedSection={setSection} sections={sections} setSections={setSections} selectedLocation={location} locations={locations} />

            <TextField fullWidth label="Date Acquired" type="date" value={dateAcquired} onChange={(e) => setDateAcquired(e.target.value)} sx={{ mb: 2 }} size="small" InputLabelProps={{ shrink: true }} />

            <TextField fullWidth label="Notes" multiline rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ mb: 2 }} />

            <TextField fullWidth label="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} sx={{ mb: 2 }} size="small" />

            <TextField fullWidth label="Funding Source" value={fundingSource} onChange={(e) => setFundingSource(e.target.value)} sx={{ mb: 2 }} size="small" />

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

            <TextField fullWidth label="Subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} sx={{ mb: 2 }} size="small" />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', paddingBottom: '15px' }}>
                <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{
                        borderColor: '#CC0000',
                        color: '#CC0000',
                        '&:hover': {
                            borderColor: '#a00000',
                            color: '#a00000'
                        }
                    }}
                >
                    Back
                </Button>

                <Box>
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{ borderColor: "#ea4040", color: "#ea4040", mr: 1 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{ background: "#ea4040" }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default BookMetadataForm;
