import React, { useState, useEffect } from "react";
import { WeedingCriteria } from "../../../../types/Catalog/WeedingCriteria";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { ModalForm } from "../../../../components";
import ConfirmationDialog from ".";
import { useAddCriteria } from "./useAddCriteria";
import { useUpdateWeedingCriteria } from "../useUpdateWeedingCriteria";

interface CriteriaModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm?: (criteria: WeedingCriteria) => void;
    initialCriteria?: WeedingCriteria | null;
    allCriteria: WeedingCriteria[];
}

const CriteriaModal: React.FC<CriteriaModalProps> = ({ open, onClose, onConfirm, initialCriteria, allCriteria }) => {
    const [criteria, setCriteria] = useState<WeedingCriteria>({
        ddcCategory: "",
        yearsBeforeWeeding: 0,
        conditionThreshold: "",
        usageThreshold: 0,
        language: "",
        duplicationCheck: false,
        criteriaStatus: true,
    });
    const showSnackbar = useSnackbarContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [secondaryConfirmDialogOpen, setSecondaryConfirmDialogOpen] = useState(false);

    const { mutateAsync: addWeedingCriteria, isPending: isAdding } = useAddCriteria();
    const { mutateAsync: updateWeedingCriteria, isPending: isUpdating } = useUpdateWeedingCriteria();

    useEffect(() => {
        if (open) {
            if (initialCriteria) {
                setCriteria({
                    ...initialCriteria,
                    duplicationCheck: initialCriteria.duplicationCheck,
                    criteriaStatus: initialCriteria.criteriaStatus,
                });
            } else {
                resetFields();
            }
        }
    }, [open, initialCriteria]);

    const resetFields = () => {
        setCriteria({
            ddcCategory: "",
            yearsBeforeWeeding: 0,
            conditionThreshold: "",
            usageThreshold: 0,
            language: "",
            duplicationCheck: false,
            criteriaStatus: true,
        });
    };

    const checkActiveCriteriaForddcCategory = (ddcCategory: string): boolean => {
        return allCriteria.some((c) => c.ddcCategory === ddcCategory && c.criteriaStatus && c.id !== criteria.id);
    };

    const handleSubmit = async () => {
        if (isSubmitting || isAdding || isUpdating) return;

        setIsSubmitting(true);
        try {
            if (criteria.id) {
                // Editing existing criteria
                if (criteria.criteriaStatus && checkActiveCriteriaForddcCategory(criteria.ddcCategory)) {
                    // If activating and there's an active criteria, show secondary confirmation
                    setSecondaryConfirmDialogOpen(true);
                } else {
                    // If not activating or no active criteria for this ddcCategory, proceed with confirmation
                    setConfirmDialogOpen(true);
                }
            } else {
                // Adding new criteria
                if (checkActiveCriteriaForddcCategory(criteria.ddcCategory)) {
                    // If there's an active criteria for this ddcCategory, show secondary confirmation
                    setSecondaryConfirmDialogOpen(true);
                } else {
                    // No active criteria for this ddcCategory, add directly
                    const newCriteria = await addWeedingCriteria({
                        ...criteria,
                        yearsBeforeWeeding: Number(criteria.yearsBeforeWeeding),
                        usageThreshold: Number(criteria.usageThreshold),
                        duplicationCheck: criteria.duplicationCheck,
                    });
                    showSnackbar("Criteria added successfully!", "success");
                    onClose();
                    if (onConfirm) onConfirm(newCriteria);
                }
            }
        } catch (error) {
            console.error("Error handling criteria:", error);
            showSnackbar("Failed to handle criteria!", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmEdit = async () => {
        try {
            const updatedCriteria = await updateWeedingCriteria(criteria);
            showSnackbar("Criteria updated successfully!", "success");
            onClose();
            if (onConfirm) {
                onConfirm(updatedCriteria); // Update state in parent
            }
        } catch (error) {
            console.error("Error updating criteria:", error);
            showSnackbar("Failed to update criteria!", "error");
        } finally {
            setConfirmDialogOpen(false);
        }
    };

    const handleConfirmddcCategoryChange = async () => {
        try {
            // Deactivate other criteria for the same ddcCategory
            const otherCriteria = allCriteria.filter((c) => c.ddcCategory === criteria.ddcCategory && c.id !== criteria.id);
            await Promise.all(
                otherCriteria.map((c) =>
                    c.criteriaStatus ? updateWeedingCriteria({ ...c, criteriaStatus: false }) : Promise.resolve()
                )
            );

            let confirmedCriteria: WeedingCriteria;
            if (criteria.id) {
                // If editing, update the existing criteria
                confirmedCriteria = await updateWeedingCriteria(criteria);
            } else {
                // If adding new, add the new criteria
                confirmedCriteria = await addWeedingCriteria({
                    ...criteria,
                    yearsBeforeWeeding: Number(criteria.yearsBeforeWeeding),
                    usageThreshold: Number(criteria.usageThreshold),
                    duplicationCheck: criteria.duplicationCheck,
                    criteriaStatus: true,
                });
            }

            showSnackbar("Criteria updated/added successfully!", "success");
            onClose();
            if (onConfirm) onConfirm(confirmedCriteria);
        } catch (error) {
            console.error("Error handling criteria:", error);
            showSnackbar("Failed to handle criteria!", "error");
        } finally {
            setSecondaryConfirmDialogOpen(false);
        }
    };

    const handleFieldChange = (value: string, key: keyof WeedingCriteria) => {
        let newValue: string | number | boolean = value;

        if (key === "yearsBeforeWeeding" || key === "usageThreshold") {
            newValue = Number(value);
        } else if (key === "duplicationCheck") {
            newValue = value === "Yes";
        } else if (key === "criteriaStatus") {
            newValue = value === "Active";
        }

        setCriteria((prev) => ({
            ...prev,
            [key]: newValue,
        }));
    };

    return (
        <>
            <ModalForm
                open={open}
                handleClose={() => {
                    resetFields();
                    onClose();
                }}
                title={initialCriteria ? "Edit Weeding Criteria" : "Add Weeding Criteria"}
                fields={[
                    {
                        label: "Dewey Decimal Classification (Main Division)",
                        type: "select",
                        value: criteria.ddcCategory,
                        onChange: (value) => handleFieldChange(value, "ddcCategory"),
                        options: ["000", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
                        required: true,
                    },
                    {
                        label: "Years after publication to be considered outdated",
                        type: "number",
                        value: criteria.yearsBeforeWeeding.toString(),
                        onChange: (value) => handleFieldChange(value, "yearsBeforeWeeding"),
                        required: true,
                    },
                    {
                        label: "Condition Threshold",
                        type: "select",
                        value: criteria.conditionThreshold,
                        onChange: (value) => handleFieldChange(value, "conditionThreshold"),
                        options: [
                            "Poor",
                            "Fair",
                            "Good",
                            "New",
                            "Like New",
                            "Damaged",
                            "Water Damaged",
                            "Repaired",
                            "Missing Parts",
                        ],
                        required: true,
                    },
                    {
                        label: "Minimum annual checkouts",
                        type: "number",
                        value: criteria.usageThreshold.toString(),
                        onChange: (value) => handleFieldChange(value, "usageThreshold"),
                        required: true,
                    },
                    {
                        label: "Language",
                        type: "text",
                        value: criteria.language,
                        onChange: (value) => handleFieldChange(value, "language"),
                        required: true,
                    },
                    {
                        label: "Check for Duplication",
                        type: "select",
                        value: criteria.duplicationCheck ? "Yes" : "No",
                        onChange: (value) => handleFieldChange(value, "duplicationCheck"),
                        options: ["Yes", "No"],
                        required: true,
                    },
                    {
                        label: "Criteria Status",
                        type: "select",
                        value: criteria.criteriaStatus ? "Active" : "Deactivate",
                        onChange: (value) => handleFieldChange(value, "criteriaStatus"),
                        options: ["Active", "Deactivate"],
                        required: true,
                    },
                ]}
                onConfirm={handleSubmit}
                confirmText="Confirm"
            />

            {/* Confirmation Dialog for Standard Editing */}
            <ConfirmationDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmEdit}
                title="Confirm Edit"
                message="Are you sure you want to update this criteria?"
                confirmText="Update"
            />

            {/* Secondary Confirmation Dialog for ddcCategory Activation */}
            <ConfirmationDialog
                open={secondaryConfirmDialogOpen}
                onClose={() => setSecondaryConfirmDialogOpen(false)}
                onConfirm={handleConfirmddcCategoryChange}
                title="Confirm Criteria Activation"
                message={`Activating this criteria will deactivate the current active criteria for DDC ${criteria.ddcCategory}. Are you sure?`}
                confirmText="Confirm Activation"
            />
        </>
    );
};

export default CriteriaModal;