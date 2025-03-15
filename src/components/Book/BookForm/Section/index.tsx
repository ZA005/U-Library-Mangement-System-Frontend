import React, { useState, useEffect } from "react";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { LibrarySections } from "../../../../types/Catalog/LibrarySection";
import EntitySelect from "../../../SelectMenuSwitch";
import { useFetchAllLibrarySections } from "./useFetchLibrarySections";
import { useUpdateLibrarySectionStatus } from "./useUpdateLibrarySectionStatus";
import ModalForm from "../../../Modal/ModalForm"; // Assuming ModalForm is reusable for this

import { useAddLibrarySection } from "./useAddLibrarySection"; // Assuming similar hook as useAddLibraryLocation

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
    const [newSectionName, setNewSectionName] = useState(""); // Only one field for section name

    const { addLibrarySection, isError, error, isSuccess } = useAddLibrarySection();

    const handleAddNewEntity = () => {
        setModalOpen(true); // Open modal when "Add New Section" is clicked
    };

    const handleCloseModal = () => {
        setModalOpen(false); // Close modal when Cancel is clicked
    };

    const handleSubmitNewSection = () => {
        if (newSectionName) {
            const newSection: LibrarySections = {
                sectionName: newSectionName, // Assuming section name is enough for the new section
                status: true,
                location: { id: locationId, codeName: "", name: "", status: true }
            };

            addLibrarySection(newSection); // Add new section via the mutation hook
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
            <EntitySelect
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
