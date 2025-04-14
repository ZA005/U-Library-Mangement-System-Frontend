import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Dropdown, DynamicTable, DynamicTableCell, PageTitle } from "../../../components";
import { bookWeedingStatusOptions } from "../../../utils/BookWeedingStatusOptions";
import { WeedingInfo } from "../../../types/Catalog/WeedingInfo";
import { useFetchFlaggedBooks } from "./useFetchFlaggedBooks";
import { useFetchAddFlaggedBooks } from "./useFetchAddFlaggedBooks";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";
import renderActionBasedOnStatus from "./redenderActionBasedOnStatus";

const WeedingPage: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const { role } = useAuth();
    const showSnackbar = useSnackbarContext();
    const { isLoading, data, error: fetchError, refetch } = useFetchFlaggedBooks();
    const flaggedBooks = Array.isArray(data) ? data : [];
    const { initiateWeeding, isLoading: isInitiating, data: initiationResult, error: initiationError } =
        useFetchAddFlaggedBooks();

    const [filter, setFilter] = useState<{
        criteria?: string;
        accessionNumber?: string;
        status: string;
    }>({
        status: "FLAGGED",
    });

    useEffect(() => {
        setTitle("Book Weeding - Library Management System");
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
        if (fetchError) {
            console.error("Fetch error:", fetchError);
            showSnackbar("Unable to load books. Please try again later.", "error");
        }
    }, [fetchError, showSnackbar]);

    const handleFilterChange = (field: keyof typeof filter, value: string) => {
        setFilter((prev) => ({ ...prev, [field]: value }));
    };

    const handleOpenModal = (weedInfo: WeedingInfo) => {
        console.log("Open modal for:", weedInfo);
    };

    const onOverrideWeeding = (id: number) => {
        console.log("Override weeding for ID:", id);
    };

    const initiateWeedingProcess = () => {
        const initiator = role || "SYSTEM";
        initiateWeeding(initiator, {
            onSuccess: () => {
                showSnackbar("Weeding process initiated successfully.", "success");
                refetch();
            },
            onError: (err) => {
                showSnackbar(`Failed to initiate weeding process: ${err.message}`, "error");
            },
        });
    };

    const filteredBooks = flaggedBooks.filter((book) => {
        const matchesCriteria = filter.criteria
            ? book.weedingCriteriaDdc?.toLowerCase().includes(filter.criteria.toLowerCase())
            : true;
        const matchesAccession = filter.accessionNumber
            ? book.accessionNumber?.toLowerCase().includes(filter.accessionNumber.toLowerCase())
            : true;
        const matchesStatus =
            !filter.status || filter.status === "All Status" ? true : book.weedStatus === filter.status;

        return matchesCriteria && matchesAccession && matchesStatus;
    });


    const columns = [
        { key: "accessionNumber", label: "Accession Number" },
        { key: "callNumber", label: "Call Number" },
        { key: "bookTitle", label: "Title" },
        { key: "authors", label: "Author" },
        { key: "weedingCriteriaDdc", label: "Weeding Criteria" },
        {
            key: "action",
            label: "Status/Action",
            render: (row: WeedingInfo) => (
                <DynamicTableCell
                    type="custom"
                    content={renderActionBasedOnStatus(row, handleOpenModal, onOverrideWeeding, role || "")}
                />
            ),
        },
    ];

    return (
        <>
            <PageTitle title="Manage Book Weeding" />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", gap: 2, maxWidth: "70%" }}>
                    <TextField
                        size="small"
                        label="Search Criteria"
                        variant="outlined"
                        value={filter.criteria || ""}
                        onChange={(e) => handleFilterChange("criteria", e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={15} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        size="small"
                        label="Search Accession Number"
                        variant="outlined"
                        value={filter.accessionNumber || ""}
                        onChange={(e) => handleFilterChange("accessionNumber", e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={15} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Dropdown
                        label="Select Status"
                        value={filter.status}
                        onChange={(e) => handleFilterChange("status", e.target.value as string)}
                        options={bookWeedingStatusOptions.map((status) => ({
                            id: status.id,
                            name: status.name,
                        }))}
                    />
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="text"
                        sx={{
                            color: "#EA4040",
                            textTransform: "none",
                            ":hover": {
                                backgroundColor: "#f2f2f2",
                                color: "#d13333",
                            },
                        }}
                    // onClick={() => navigate('/admin/catalog/management/criteria')}
                    >
                        View Criteria
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={initiateWeedingProcess}
                        disabled={isInitiating}
                    >
                        Initiate Book Weeding Process
                    </Button>
                </Box>
            </Box>
            <Box mt={2}>
                <DynamicTable
                    columns={columns}
                    data={filteredBooks}
                    loading={isLoading}
                    customMsg={
                        !isLoading && flaggedBooks.length === 0
                            ? "No books flagged for weeding."
                            : !isLoading && filteredBooks.length === 0
                                ? "No matching records found with the current filters."
                                : "No books available"
                    }
                    customSize="200px"
                />

            </Box>
        </>
    );
};

export default WeedingPage;