/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton, MenuItem, Select, FormControlLabel, Container, Button, TextField, InputAdornment } from "@mui/material";
import { Menu, Search } from "lucide-react";
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { DynamicTable, IosSwitch, PageTitle } from "../../../components";
import { useFetchWeedingCriterias } from "./useFetchWeedingCriterias";
import { WeedingCriteria } from "../../../types/Catalog/WeedingCriteria";
import ConfirmationDialog from "./Dialog";
import { useUpdateWeedingCriteria } from "./useUpdateWeedingCriteria";
import CriteriaModal from "./Dialog/CriteriaModal";
import { useRemoveCriteria } from "./useRemoveCriteria";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";

const WeedingCriteriaPage: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const showSnackbar = useSnackbarContext();
    const [, setSelectedOption] = useState<string>("");
    const [criteriaData, setCriteriaData] = useState<WeedingCriteria[]>([]);
    const [currentToggle, setCurrentToggle] = useState<WeedingCriteria & { additionalMessage?: string } | null>(null);
    const [secondaryConfirmationOpen, setSecondaryConfirmationOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteCriteria, setToDeleteCriteria] = useState<WeedingCriteria | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [editingCriteria, setEditingCriteria] = useState<WeedingCriteria | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { isLoading, data: WeedingCriteria = [], error, refetch } = useFetchWeedingCriterias();
    const { mutateAsync: updateWeedingCriteria } = useUpdateWeedingCriteria();
    const { removeCriteria, isPending: isDeleting } = useRemoveCriteria();

    useEffect(() => {
        setTitle("Book Weeding Criteria - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)}>
                <Menu color="#d32f2f" />
            </IconButton>
        );
        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    useEffect(() => {
        setCriteriaData(WeedingCriteria);
    }, [WeedingCriteria]);

    // Filter criteriaData based on searchQuery
    const filteredCriteria = useMemo(() => {
        if (!searchQuery.trim()) {
            return criteriaData;
        }

        const lowerCaseQuery = searchQuery.toLowerCase();
        return criteriaData.filter((item) => {
            const ddcCategory = item.ddcCategory?.toLowerCase() || "";
            const statusText = item.criteriaStatus ? "activated" : "deactivated";
            return ddcCategory.includes(lowerCaseQuery) || statusText.includes(lowerCaseQuery);
        });
    }, [criteriaData, searchQuery]);

    const handleToggleSwitch = (item: WeedingCriteria) => {
        setCurrentToggle(item);
        setDialogOpen(true);
    };

    const handleSelectChange = (value: string, item: WeedingCriteria) => {
        setSelectedOption(value);
        if (value === "edit") {
            setEditingCriteria(item);
            setModalOpen(true);
        } else if (value === "remove") {
            setToDeleteCriteria(item);
            setDeleteConfirmationOpen(true);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingCriteria(null);
    };

    const handleModalConfirm = (updatedCriteria: WeedingCriteria) => {
        setCriteriaData((prev) =>
            updatedCriteria.id
                ? prev.map((c) => (c.id === updatedCriteria.id ? updatedCriteria : c)) // Update existing criteria
                : [...prev, updatedCriteria] // Add new criteria
        );
        setModalOpen(false);
        setEditingCriteria(null);
        refetch();
    };

    const columns = [
        { key: "ddcCategory", label: "DDC Criteria" },
        { key: "yearsBeforeWeeding", label: "Min Years Old" },
        { key: "conditionThreshold", label: "Condition Threshold" },
        { key: "usageThreshold", label: "Usage Threshold" },
        { key: "language", label: "Language" },
        {
            key: "duplicationCheck",
            label: "Duplication Check",
            render: (row: WeedingCriteria) => (row.duplicationCheck ? "Yes" : "No"),
        },
        {
            key: "criteriaStatus",
            label: "Criteria Status",
            render: (row: WeedingCriteria) => (
                <FormControlLabel
                    control={
                        <IosSwitch
                            sx={{ m: 1 }}
                            checked={row.criteriaStatus}
                            onChange={() => handleToggleSwitch(row)}
                        />
                    }
                    label={row.criteriaStatus ? "Activated" : "Deactivated"}
                />
            ),
        },
        {
            key: "action",
            label: "Action",
            render: (row: WeedingCriteria) => (
                <Select
                    value=""
                    onChange={(e) => handleSelectChange(e.target.value, row)}
                    displayEmpty
                    size="small"
                >
                    <MenuItem value="" disabled>
                        Action
                    </MenuItem>
                    <MenuItem value="edit">Edit</MenuItem>
                    <MenuItem value="remove">Remove</MenuItem>
                </Select>
            ),
        },
    ];

    const handleConfirmToggle = async () => {
        if (!currentToggle) return;

        const isActivating = !currentToggle.criteriaStatus;

        const sameCategory = criteriaData.filter((c) => c.ddcCategory === currentToggle.ddcCategory);

        const currentlyActive = sameCategory.find((c) => c.criteriaStatus);

        if (isActivating && currentlyActive && currentlyActive.id !== currentToggle.id) {
            setDialogOpen(false);
            setSecondaryConfirmationOpen(true);
        } else {
            try {
                await updateWeedingCriteria({
                    ...currentToggle,
                    criteriaStatus: isActivating,
                });
                showSnackbar(`Criteria ${isActivating ? "activated" : "deactivated"} successfully!`, "success");
                setDialogOpen(false);
                refetch();
            } catch (err) {
                console.error("Error while toggling criteria:", err);
                showSnackbar("Failed to toggle criteria!", "error");
            }
        }
    };

    const handleSecondaryConfirmation = async () => {
        if (!currentToggle) return;

        const sameCategory = criteriaData.filter((c) => c.ddcCategory === currentToggle.ddcCategory);

        const currentlyActive = sameCategory.find((c) => c.criteriaStatus);

        try {
            if (currentlyActive && currentlyActive.id !== currentToggle.id) {
                await updateWeedingCriteria({
                    ...currentlyActive,
                    criteriaStatus: false,
                });
            }

            await updateWeedingCriteria({
                ...currentToggle,
                criteriaStatus: true,
            });

            showSnackbar("Criteria activated successfully!", "success");
            setSecondaryConfirmationOpen(false);
            refetch();
        } catch (err) {
            console.error("Error in secondary confirmation update:", err);
            showSnackbar("Failed to update criteria!", "error");
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false);
        setToDeleteCriteria(null);
    };

    const handleConfirmDelete = () => {
        if (!toDeleteCriteria || !toDeleteCriteria.id) return;

        removeCriteria(toDeleteCriteria.id, {
            onSuccess: () => {
                showSnackbar("Criteria deleted successfully!", "success");
                setDeleteConfirmationOpen(false);
                setToDeleteCriteria(null);
                refetch();
            },
            onError: (err) => {
                console.error("Error deleting the criteria:", err);
                showSnackbar(err.message || "Failed to delete criteria!", "error");
            },
        });
    };

    const handleOpenModal = (criteriaToEdit?: WeedingCriteria) => {
        setEditingCriteria(criteriaToEdit || null);
        setModalOpen(true);
    };

    return (
        <>
            <PageTitle title="Manage Weeding Criteria" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                    alignItems="center"
                    gap={2}
                >
                    <Box display="flex" gap={1}>
                        <Button
                            variant="contained"
                            onClick={() => handleOpenModal()}
                            sx={{
                                width: { xs: "100%", md: "200px" },
                                backgroundColor: "#d32f2f",
                                "&:disabled": {
                                    backgroundColor: "#b71c1c",
                                },
                            }}
                            disabled={isDeleting}
                        >
                            New Criteria
                        </Button>
                    </Box>

                    <TextField
                        size="small"
                        label="Search By Criteria/Status"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={15} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Container>
            <Box mt={4}>
                <DynamicTable
                    columns={columns}
                    data={filteredCriteria}
                    loading={isLoading || isDeleting}
                    error={error ? error.message || "An unknown error occurred" : undefined}
                    customMsg={searchQuery ? "No matching criteria found" : "No Weeding Criteria Found"}
                    hasSelection={false}
                />
            </Box>
            {/* Modal for Adding/Editing Criteria */}
            <CriteriaModal
                open={modalOpen}
                onClose={handleCloseModal}
                onConfirm={handleModalConfirm}
                initialCriteria={editingCriteria}
                allCriteria={criteriaData}
            />
            {/* Confirmation Dialog */}
            <ConfirmationDialog
                open={dialogOpen}
                onClose={() => {
                    setCurrentToggle((prev) => (prev ? { ...prev, additionalMessage: undefined } : null));
                    setDialogOpen(false);
                }}
                onConfirm={handleConfirmToggle}
                title={currentToggle?.additionalMessage ? "Confirm Criteria Change" : "Confirm Status Change"}
                message={
                    currentToggle?.additionalMessage ||
                    `Are you sure you want to ${currentToggle?.criteriaStatus ? "deactivate" : "activate"} '${currentToggle?.ddcCategory
                    }' weeding criteria?`
                }
                confirmText={
                    currentToggle?.criteriaStatus
                        ? "Deactivate"
                        : currentToggle?.additionalMessage
                            ? "Activate New"
                            : "Activate"
                }
            />

            {/* Secondary Confirmation Dialog */}
            <ConfirmationDialog
                open={secondaryConfirmationOpen}
                onClose={() => {
                    setSecondaryConfirmationOpen(false);
                    setCurrentToggle((prev) => (prev ? { ...prev, additionalMessage: undefined } : null));
                }}
                onConfirm={handleSecondaryConfirmation}
                title="Confirm Criteria Change"
                message={`Are you sure you want to deactivate the current active criteria for DDC ${currentToggle?.ddcCategory} and activate this one?`}
                confirmText="Confirm"
            />

            {/* Confirmation Dialog for Deletion */}
            <ConfirmationDialog
                open={deleteConfirmationOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to delete the criteria for DDC ${toDeleteCriteria?.ddcCategory}?`}
                confirmText="Delete"
                isSubmitting={isDeleting}
            />
        </>
    );
};

export default WeedingCriteriaPage;