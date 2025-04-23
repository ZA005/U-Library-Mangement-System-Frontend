/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton, MenuItem, Select, FormControlLabel, Container, Button, TextField, InputAdornment } from "@mui/material";
import { Menu, Search } from "lucide-react";
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DynamicTable, IosSwitch, PageTitle } from "../../../components";
import { useFetchWeedingCriterias } from "./useFetchWeedingCriterias";
import { WeedingCriteria } from "../../../types/Catalog/WeedingCriteria";
import ConfirmationDialog from "./Dialog";
import { useUpdateWeedingCriteria } from "./useUpdateWeedingCriteria";

const WeedingCriteriaPage: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const [selectedOption, setSelectedOption] = useState<string>("");
    const [criteriaData, setCriteriaData] = useState<any[]>([]);
    const [currentToggle, setCurrentToggle] = useState<WeedingCriteria & { additionalMessage?: string } | null>(null);
    const [secondaryConfirmationOpen, setSecondaryConfirmationOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteCriteria, setToDeleteCriteria] = useState<WeedingCriteria | null>(null);

    const { isLoading, data: WeedingCriteria = [], error, refetch } = useFetchWeedingCriterias();
    const { mutateAsync: updateWeedingCriteria, isPending: isUpdating } = useUpdateWeedingCriteria();

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

    const handleToggleSwitch = (item: WeedingCriteria) => {
        setCurrentToggle(item);
        setDialogOpen(true);
    };

    const handleSelectChange = (value: string, item: any) => {
        setSelectedOption(value);
        if (value === "edit") {
            // Edit logic here
            console.log("Editing item:", item);
        } else if (value === "remove") {
            // Remove logic here
            console.log("Removing item:", item);
        }
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
            render: (row: any) => (row.duplicationCheck ? "Yes" : "No"),
        },
        {
            key: "criteriaStatus",
            label: "Criteria Status",
            render: (row: any) => (
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
            render: (row: any) => (
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

        const sameCategory = criteriaData.filter(
            (c) => c.ddcCategory === currentToggle.ddcCategory
        );

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
                setDialogOpen(false);
                refetch();
            } catch (err) {
                console.error("Error while toggling criteria:", err);
            }
        }
    };

    const handleSecondaryConfirmation = async () => {
        if (!currentToggle) return;

        const sameCategory = criteriaData.filter(
            (c) => c.ddcCategory === currentToggle.ddcCategory
        );

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

            setSecondaryConfirmationOpen(false);
            refetch();
        } catch (err) {
            console.error("Error in secondary confirmation update:", err);
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false);
        setToDeleteCriteria(null);
    };

    const handleConfirmDelete = async () => {
        if (!toDeleteCriteria) return;
        try {
            refetch();
        } catch (err) {
            console.error("Error deleting the criteria:", err);
        }
    };

    const handleNewCriteria = () => {

    }

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
                            onClick={handleNewCriteria}
                            sx={{
                                width: { xs: "100%", md: "200px" },
                                backgroundColor: "#d32f2f",
                                "&:disabled": {
                                    backgroundColor: "#b71c1c",
                                },
                            }}>
                            New Criteria
                        </Button>
                    </Box>

                    <TextField
                        size="small"
                        label="Search By Title/ID/Name"
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
                    data={criteriaData}
                    loading={isLoading}
                    error={error}
                    customMsg="No Weeding Criteria Found"
                    hasSelection={false}
                />
            </Box>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                open={dialogOpen}
                onClose={() => {
                    setCurrentToggle(prev => prev ? { ...prev, additionalMessage: undefined } : null);
                    setDialogOpen(false);
                }}
                onConfirm={handleConfirmToggle}
                title={currentToggle?.additionalMessage ? "Confirm Criteria Change" : "Confirm Status Change"}
                message={currentToggle?.additionalMessage || `Are you sure you want to ${currentToggle?.criteriaStatus ? 'deactivate' : 'activate'} '${currentToggle?.ddcCategory}' weeding criteria?`}
                confirmText={currentToggle?.criteriaStatus ? 'Deactivate' : (currentToggle?.additionalMessage ? 'Activate New' : 'Activate')}
            />

            {/* Secondary Confirmation Dialog */}
            <ConfirmationDialog
                open={secondaryConfirmationOpen}
                onClose={() => {
                    setSecondaryConfirmationOpen(false);
                    setCurrentToggle(prev => prev ? { ...prev, additionalMessage: undefined } : null);
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
            />
        </>
    );
};

export default WeedingCriteriaPage;
