import React, { useState, useEffect } from "react";
import { useFetchAllLibraryLocations } from "./useFetchLibraryLocations";
import { useUpdateLibraryLocationStatus } from "./useUpdateLibraryLocationStats";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { LibraryLocations } from "../../../../types/Catalog/LibraryLocation";
import { useAddLibraryLocation } from "./useAddLibraryLocation";
import { DropdownSwitch, ModalForm } from "../../..";
interface LocationSelectProps {
    selectedLocation: LibraryLocations | null;
    onLocationChange: (location: LibraryLocations | null) => void;
}

const LocationSelectWrapper: React.FC<LocationSelectProps> = ({ selectedLocation, onLocationChange }) => {
    const { data: allLibraryLocations = [], refetch } = useFetchAllLibraryLocations();
    const { updateStatus } = useUpdateLibraryLocationStatus();
    const showSnackbar = useSnackbarContext();
    const [isModalOpen, setModalOpen] = useState(false);
    const [newLocationCodeName, setNewLocationCodeName] = useState("");
    const [newLocationName, setNewLocationName] = useState("");

    const { addLibraryLocation, isError, error, isSuccess } = useAddLibraryLocation();

    const handleAddNewEntity = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmitNewLocation = () => {
        if (newLocationCodeName && newLocationName) {
            const newLocation: LibraryLocations = {
                codeName: newLocationCodeName,
                name: newLocationName,
                status: true,
            };
            addLibraryLocation(newLocation);
        }
    };

    // Fields for the modal
    const fields = [
        {
            label: "Location Code Name",
            type: "text" as const,
            value: newLocationCodeName,
            onChange: setNewLocationCodeName,
            required: true,
        },
        {
            label: "Location Name",
            type: "text" as const,
            value: newLocationName,
            onChange: setNewLocationName,
            required: true,
        },
    ];

    useEffect(() => {
        if (isSuccess) {
            refetch();
            showSnackbar("New location added successfully", "success");
            setNewLocationCodeName("");
            setNewLocationName("");
            setModalOpen(false);
        }

        if (isError) {
            showSnackbar(`Failed to add location: ${error?.message}`, "error");
        }
    }, [isSuccess, isError, refetch, showSnackbar, error]);

    return (
        <>
            <DropdownSwitch
                label="Library Location"
                entities={allLibraryLocations}
                selectedEntity={selectedLocation}
                onEntityChange={onLocationChange}
                onUpdateStatus={async (id: number, status: boolean) => updateStatus({ id, status })}
                onAddNewEntity={handleAddNewEntity}
                showSnackbar={showSnackbar}
                valueField="codeName"
                displayField="name"
            />

            <ModalForm
                open={isModalOpen}
                handleClose={handleCloseModal}
                title="Add New Library Location"
                fields={fields}
                onConfirm={handleSubmitNewLocation}
                confirmText="Submit"
            />
        </>
    );
};

export default LocationSelectWrapper;
