import React, { useState, useEffect } from "react";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { LibrarySections } from "../../../../types/Catalog/LibrarySection";
import { useFetchAllLibrarySections } from "./useFetchLibrarySections";
import { useUpdateLibrarySectionStatus } from "./useUpdateLibrarySectionStatus";
import { DropdownSwitch, ModalForm } from "../../../../components";
import { useAddLibrarySection } from "./useAddLibrarySection";

interface SectionSelectProps {
    selectedSection: LibrarySections | null;
    locationId: number;
    onSectionChange: (section: LibrarySections | null) => void;
    disabled?: boolean;
}

const SectionSelectWrapper: React.FC<SectionSelectProps> = ({ selectedSection, onSectionChange, locationId, disabled = false }) => {
    const { data: allLibrarySections = [], refetch } = useFetchAllLibrarySections(locationId);
    const { updateSectionStatus } = useUpdateLibrarySectionStatus();
    const showSnackbar = useSnackbarContext();

    // Modal state
    const [isModalOpen, setModalOpen] = useState(false);
    const [newSectionName, setNewSectionName] = useState("");

    const { addLibrarySection, isError, error, isSuccess } = useAddLibrarySection();

    const handleAddNewEntity = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmitNewSection = () => {
        if (newSectionName) {
            const newSection: LibrarySections = {
                sectionName: newSectionName,
                status: true,
                location: { id: locationId, codeName: "", name: "", status: true }
            };

            addLibrarySection(newSection);
        }
    };

    // Fields for the modal form
    const fields = [
        {
            label: "Section Name",
            type: "text" as const,
            value: newSectionName,
            onChange: setNewSectionName,
            required: true,
        },
    ];

    useEffect(() => {
        if (isSuccess) {
            refetch(); // Refetch the library sections after adding a new one
            showSnackbar("New section added successfully", "success");

            // Reset the form fields after successfully adding the new section
            setNewSectionName("");
            setModalOpen(false); // Close the modal
        }

        if (isError) {
            showSnackbar(`Failed to add section: ${error?.message}`, "error");
        }
    }, [isSuccess, isError, refetch, showSnackbar, error]);

    return (
        <>
            <DropdownSwitch
                label="Library Section"
                entities={allLibrarySections}
                selectedEntity={selectedSection}
                onEntityChange={onSectionChange}
                onUpdateStatus={async (id: number, status: boolean) => updateSectionStatus({ id, status })}
                onAddNewEntity={handleAddNewEntity} // Open the modal when adding a new entity
                showSnackbar={showSnackbar}
                valueField="sectionName"
                displayField="sectionName"
                disabled={disabled}
            />

            <ModalForm
                open={isModalOpen}
                handleClose={handleCloseModal}
                title="Add New Library Section"
                fields={fields}
                onConfirm={handleSubmitNewSection}
                confirmText="Submit"
            />
        </>
    );
};

export default SectionSelectWrapper;
