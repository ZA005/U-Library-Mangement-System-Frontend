import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../../../hooks/useSnackbar";
import ModalForm from "../ModalForm";
import { addWeedingCriteria, updateWeedingCriteria } from "../../../services/Cataloging/WeedingCriteriaApi";
import { WeedingCriteria } from "../../../model/Criteria";
import ConfirmationDialog from "../../ConfirmationDialog/ConfirmationDialog";

interface CriteriaModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm?: (criteria: WeedingCriteria) => void;
    initialCriteria?: WeedingCriteria; // For editing, to set initial state
    allCriteria: WeedingCriteria[];
}


const CriteriaModal: React.FC<CriteriaModalProps> = ({ open, onClose, onConfirm, initialCriteria, allCriteria }) => {
    const [criteria, setCriteria] = useState<WeedingCriteria>({
        ddc: '',
        minYearsOld: 0,
        conditionThreshold: '',
        usageThreshold: 0,
        language: '',
        duplicationCheck: false,
        criteriaStatus: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [secondaryConfirmDialogOpen, setSecondaryConfirmDialogOpen] = useState(false);

    const {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    } = useSnackbar();

    useEffect(() => {
        if (open) {
            if (initialCriteria) {
                setCriteria({
                    ...initialCriteria,
                    duplicationCheck: initialCriteria.duplicationCheck,
                    criteriaStatus: initialCriteria.criteriaStatus
                });
            } else {
                resetFields();
            }
        }
    }, [open, initialCriteria]);


    const resetFields = () => {
        setCriteria({
            ddc: '',
            minYearsOld: 0,
            conditionThreshold: '',
            usageThreshold: 0,
            language: '',
            duplicationCheck: false,
            criteriaStatus: true
        });
    };

    const checkActiveCriteriaForDDC = (ddc: string): boolean => {
        return allCriteria.some(c => c.ddc === ddc && c.criteriaStatus && c.id !== criteria.id);
    };


    const handleSubmit = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            if (criteria.id) {
                if (criteria.criteriaStatus && checkActiveCriteriaForDDC(criteria.ddc)) {
                    // If activating and there's an active criteria, show secondary confirmation
                    setSecondaryConfirmDialogOpen(true);
                } else {
                    // If not activating or no active criteria for this DDC, proceed with confirmation
                    setConfirmDialogOpen(true);
                }
            } else {
                // Handle adding new criteria
                if (checkActiveCriteriaForDDC(criteria.ddc)) {
                    // If there's an active criteria for this DDC, show secondary confirmation
                    setSecondaryConfirmDialogOpen(true);
                } else {
                    // No active criteria for this DDC, add directly
                    await addWeedingCriteria({
                        ...criteria,
                        minYearsOld: Number(criteria.minYearsOld),
                        usageThreshold: Number(criteria.usageThreshold),
                        duplicationCheck: criteria.duplicationCheck
                    });
                    openSnackbar("Criteria added successfully!", "success");
                    onClose();
                    if (onConfirm) onConfirm(criteria);
                }
            }
        } catch (error) {
            console.error("Error handling criteria:", error);
            openSnackbar("Failed to handle criteria!", "error");
        } finally {
            setTimeout(() => setIsSubmitting(false), 2000);
        }
    };

    const handleConfirmEdit = async () => {
        try {
            await updateWeedingCriteria(criteria);
            openSnackbar("Criteria updated successfully!", "success");
            onClose();
            if (onConfirm) {
                onConfirm(criteria); // This will update the state in CriteriaDashboard
            }
        } catch (error) {
            console.error("Error updating criteria:", error);
            openSnackbar("Failed to update criteria!", "error");
        } finally {
            setConfirmDialogOpen(false);
        }
    };

    // Update handleConfirmDDCChange to handle both add and edit scenarios
    const handleConfirmDDCChange = async () => {
        try {
            // Deactivate other criteria for the same DDC first
            const otherCriteria = allCriteria.filter(c => c.ddc === criteria.ddc);
            await Promise.all(otherCriteria.map(c => updateWeedingCriteria({ ...c, criteriaStatus: false })));

            let confirmedCriteria: WeedingCriteria;
            if (criteria.id) {
                // If editing, update the existing criteria
                confirmedCriteria = await updateWeedingCriteria(criteria);
            } else {
                // If adding new, then add the new criteria after deactivating others
                confirmedCriteria = await addWeedingCriteria({
                    ...criteria,
                    minYearsOld: Number(criteria.minYearsOld),
                    usageThreshold: Number(criteria.usageThreshold),
                    duplicationCheck: criteria.duplicationCheck,
                    criteriaStatus: true // Ensure new criteria is set to active
                });
            }

            openSnackbar("Criteria updated/added successfully!", "success");
            onClose();
            if (onConfirm) onConfirm(confirmedCriteria);
        } catch (error) {
            console.error("Error handling criteria:", error);
            openSnackbar("Failed to handle criteria!", "error");
        } finally {
            setSecondaryConfirmDialogOpen(false);
        }
    };

    const handleFieldChange = (value: string, key: keyof typeof criteria) => {
        let newValue: string | number | boolean = value;

        if (key === 'minYearsOld' || key === 'usageThreshold') {
            newValue = Number(value);
        } else if (key === 'duplicationCheck') {
            newValue = value === 'Yes';
        } else if (key === 'criteriaStatus') {
            newValue = value === 'Active';
        }

        setCriteria(prev => ({
            ...prev,
            [key]: newValue
        }));
    };

    return (
        <>
            <ModalForm
                open={open}
                handleClose={() => {
                    resetFields();  // Reset the fields when canceling
                    onClose();  // Close the modal
                }}
                title="Add Weeding Criteria"
                fields={[
                    {
                        label: "Dewey Decimal Classification(Main Division)",
                        type: "select",
                        value: criteria.ddc,
                        onChange: (value) => handleFieldChange(value, 'ddc'),
                        options: [
                            "000",
                            "100",
                            "200",
                            "300",
                            "400",
                            "500",
                            "600",
                            "700",
                            "800",
                            "900",
                        ],
                        required: true
                    },

                    {
                        label: "Years after publication to be considered outdated",
                        type: "number",
                        value: criteria.minYearsOld.toString(),
                        onChange: (value) => handleFieldChange(value, 'minYearsOld'),
                        required: true
                    },
                    {
                        label: "Condition Threshold",
                        type: "select",
                        value: criteria.conditionThreshold,
                        onChange: (value) => handleFieldChange(value, 'conditionThreshold'),
                        options: ["Poor", "Fair", "Good", "New", "Like New", "Damaged", "Water Damaged", "Repaired", "Missing Parts"],
                        required: true
                    },
                    {
                        label: "Minimum annual checkouts",
                        type: "number",
                        value: criteria.usageThreshold.toString(),
                        onChange: (value) => handleFieldChange(value, 'usageThreshold'),
                        required: true
                    },
                    {
                        label: "Language",
                        type: "text",
                        value: criteria.language,
                        onChange: (value) => handleFieldChange(value, 'language'),
                        required: true
                    },
                    {
                        label: "Check for Duplication",
                        type: "select",
                        value: criteria.duplicationCheck ? 'Yes' : 'No',
                        onChange: (value) => handleFieldChange(value, 'duplicationCheck'),
                        options: ["Yes", "No"],
                        required: true
                    },
                    {
                        label: "Criteria Status",
                        type: "select",
                        value: criteria.criteriaStatus ? 'Active' : 'Deactivate',
                        onChange: (value) => handleFieldChange(value, 'criteriaStatus'),
                        options: ["Active", "Deactivate"],
                        required: true
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

            {/* Secondary Confirmation Dialog for DDC Activation */}
            <ConfirmationDialog
                open={secondaryConfirmDialogOpen}
                onClose={() => setSecondaryConfirmDialogOpen(false)}
                onConfirm={handleConfirmDDCChange}
                title="Confirm Criteria Activation"
                message={`Activating this criteria will deactivate the current active criteria for DDC ${criteria.ddc}. Are you sure?`}
                confirmText="Confirm Activation"
            />

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                <Alert onClose={closeSnackbar} severity={snackbarStatus}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CriteriaModal;
