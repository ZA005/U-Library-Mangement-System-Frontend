/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, TextField, Button } from "@mui/material";
import { LibraryLocations } from "../../../types/Catalog/LibraryLocation";
import { useFetchAllLibraryLocations } from "./Location/useFetchLibraryLocations";
import LocationSelectWrapper from "./Location";
import SectionSelectWrapper from "./Section";
import { useFetchAllLibrarySections } from "./Section/useFetchLibrarySections";
import { LibrarySections } from "../../../types/Catalog/LibrarySection";
import { useEffect, useState } from "react";
import { bookConditionOptions, collectionTypeOptions, circulationStatusOptions } from "../../../utils/bookFormOptions";
import { Dropdown } from "../../../components";
import { useFetchBaseAccessionNumber } from "./useFetchBaseAccessionNumber";
import { generateAccessionNumbersCopies } from "../../../utils/generateAccessionNumbersCopies";

/**
 * SecondPage Component
 * --------------------
 * The second step of the cataloging form.
 * Allows users to input additional metadata such as acquisition details, condition, and collection type.
 */
interface SecondPageProps {
    onBack: () => void;
    formData: Record<string, any>;
    setFormData: (data: Record<string, any>) => void;
}

const SecondPage: React.FC<SecondPageProps> = ({ onBack, formData, setFormData }) => {
    const { data: allLibraryLocations = [] } = useFetchAllLibraryLocations();


    const selectedLocation = allLibraryLocations.find(
        (loc) => loc.codeName === formData.location
    ) || null;

    const [locationId, setLocationId] = useState<number | null>(selectedLocation?.id || null);

    const { data: allLibrarySections = [] } = useFetchAllLibrarySections(locationId ?? 0);

    const { data: baseAccessionNumber } = useFetchBaseAccessionNumber(
        formData.isbn || '',
        selectedLocation?.codeName || ''
    );

    useEffect(() => {
        if (selectedLocation) {
            setLocationId(selectedLocation.id ?? null);
        }
    }, [selectedLocation]);

    useEffect(() => {
        if (baseAccessionNumber) {
            const accessionNumbers = generateAccessionNumbersCopies(
                baseAccessionNumber,
                formData.numberOfCopies
            );
            setFormData({ ...formData, accessionNumbers: accessionNumbers });
        }
    }, [baseAccessionNumber, setFormData, formData]);

    const selectedSection: LibrarySections | null = Array.isArray(allLibrarySections)
        ? allLibrarySections.find((sec) => sec.sectionName === formData.section) || null
        : null;



    /**
     * Handles input changes and updates formData state
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationChange = (selectedLocation: LibraryLocations | null) => {
        setFormData({ ...formData, location: selectedLocation?.codeName || "" });
    };
    const handleSectionChange = (selectedSection: LibrarySections | null) => {
        setFormData({
            ...formData,
            section: selectedSection?.sectionName || ""
        });
    };
    return (
        <Box display="grid" gap={2}>
            <Dropdown
                label="Circulation Status"
                value={formData.collectionStatus ?? ""}
                onChange={(e) => setFormData({ ...formData, collectionStatus: e.target.value })}
                options={circulationStatusOptions.map((status) => ({
                    id: status.id,
                    name: status.name
                }))}
                menuSize={"medium"}
            />
            <TextField
                fullWidth
                label="Number of Copies"
                name="numberOfCopies"
                value={formData.numberOfCopies || ''}
                onChange={handleChange}
                type="number"
                slotProps={{
                    input: {
                        inputMode: 'numeric',
                    }
                }}
                helperText="Enter the number of copies (must be 1 or more) before selecting a location."
            />
            <TextField fullWidth label="Purchase Price" name="purchasePrice" value={formData.purchase_price} onChange={handleChange} />
            <LocationSelectWrapper selectedLocation={selectedLocation} onLocationChange={handleLocationChange} />
            <SectionSelectWrapper
                selectedSection={selectedSection}
                locationId={selectedLocation?.id || 0}
                onSectionChange={handleSectionChange}
                disabled={!selectedLocation}
            />
            <TextField fullWidth label="Date Acquired" name="dateAcquired" value={formData.acquired_date} onChange={handleChange} />
            <TextField fullWidth label="Vendor" name="vendor" value={formData.vendor} onChange={handleChange} />
            <TextField fullWidth label="Funding Source" name="fundingSource" value={formData.funding_source} onChange={handleChange} />
            <Dropdown
                label="Book Condition"
                value={formData.bookCondition ?? ""}
                onChange={(e) => setFormData({ ...formData, bookCondition: e.target.value })}
                options={bookConditionOptions.map((condition) => ({
                    id: condition.id,
                    name: condition.name
                }))}
                menuSize={"medium"}
            />

            <Dropdown
                label="Collection Type"
                value={formData.collectionType ?? ""}
                onChange={(e) => setFormData({ ...formData, collectionType: e.target.value })}
                options={collectionTypeOptions.map((type) => ({
                    id: type.id,
                    name: type.name
                }))}
                menuSize={"medium"}
            />

            <Button fullWidth variant="outlined" color="secondary" onClick={onBack}>
                Back
            </Button>
            <Button fullWidth variant="contained" color="primary">
                Save
            </Button>
        </Box>
    );
};

export default SecondPage;
