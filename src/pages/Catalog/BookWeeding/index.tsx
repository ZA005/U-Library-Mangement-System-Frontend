import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Dropdown, DynamicTable, DynamicTableCell, PageTitle } from "../../../components";
import { bookWeedingStatusOptions } from "../../../utils/BookWeedingStatusOptions";
import { WeedingInfo } from "../../../types/Catalog/WeedingInfo";
import { useFetchFlaggedBooks } from "./useFetchFlaggedBooks";
import { useFetchAddFlaggedBooks } from "./useFetchAddFlaggedBooks";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";
import renderActionBasedOnStatus from "./redenderActionBasedOnStatus";
import ReviewModal from "./Dialog/Dialog";
import { useWeedBook } from "./Dialog/useWeedBook";
import { useArchiveBook } from "./Dialog/useArchiveBook";
import { useFinalizeWeedingProcess } from "./Dialog/useFinalizeWeedingProcess";
import { useOverrideWeeding } from "./Dialog/useOverrideWeeding";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";

const WeedingPage: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const { role } = useAuth();
    const navigate = useNavigate();
    const showSnackbar = useSnackbarContext();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const { isLoading, data, error: fetchError, refetch } = useFetchFlaggedBooks();
    const flaggedBooks = Array.isArray(data) ? data : [];
    const [weedInfos, setWeedInfos] = useState<WeedingInfo[]>([]);
    const [currentWeedInfo, setCurrentWeedInfo] = useState<WeedingInfo | null>(null);
    const [isOverride, setIsOverride] = useState<boolean>(false);
    const [isArchiving, setIsArchiving] = useState<boolean>(false);
    const [processNotes, setProcessNotes] = useState<string>("");
    const [allProcessed, setAllProcessed] = useState<boolean>(false);
    const [filter, setFilter] = useState<{ criteria?: string, accessionNumber?: string, status: string }>({
        status: role === "ADMIN" ? "REVIEWED" : "FLAGGED",
    });
    const { initiateWeeding, isLoading: isInitiating, error: initiationError } = useFetchAddFlaggedBooks();

    // Use the provided hooks
    const { mutate: weedBook, isPending: isWeeding, error: weedError } = useWeedBook();
    const { mutate: overrideWeeding, isPending: isOverriding, error: overrideError } = useOverrideWeeding();
    const { mutate: archiveBook, isPending: isArchivingPending, error: archiveError } = useArchiveBook();
    const { mutate: finalizeWeedingProcess, isPending: isFinalizing, error: finalizeError } = useFinalizeWeedingProcess();

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

    useEffect(() => {
        setWeedInfos(flaggedBooks);
    }, [flaggedBooks]);

    useEffect(() => {
        if (weedError) {
            showSnackbar(`Failed to process weeding: ${weedError.message}`, "error");
        }
        if (overrideError) {
            showSnackbar(`Failed to override weeding: ${overrideError.message}`, "error");
        }
        if (archiveError) {
            showSnackbar(`Failed to archive book: ${archiveError.message}`, "error");
        }
        if (finalizeError) {
            showSnackbar(`Failed to finalize process: ${finalizeError.message}`, "error");
        }
    }, [weedError, overrideError, archiveError, finalizeError, showSnackbar]);

    const handleFilterChange = (field: keyof typeof filter, value: string) => {
        setFilter((prev) => ({ ...prev, [field]: value }));
    };

    const handleOpenModal = (weedInfo: WeedingInfo, override = false, archiving = false) => {
        setCurrentWeedInfo(weedInfo);
        setIsOverride(override);
        setIsArchiving(archiving);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsOverride(false);
        setIsArchiving(false);
        setCurrentWeedInfo(null);
    };

    const onOverrideWeeding = (bookId: number) => {
        const bookToOverride = weedInfos.find(book => book.id === bookId);
        if (bookToOverride) {
            handleOpenModal(bookToOverride, true);
        } else {
            showSnackbar("Book not found for overriding.", "error");
        }
    };

    const handleWeedBook = (bookWeedingStatusNotes: string) => {
        if (currentWeedInfo) {
            const newStatus = role === "LIBRARIAN" ? "REVIEWED" : "WEEDED";
            const updatedWeedInfo = { ...currentWeedInfo, bookWeedingStatusNotes, weedStatus: newStatus };
            weedBook(updatedWeedInfo, {
                onSuccess: () => {
                    showSnackbar(
                        newStatus === "REVIEWED"
                            ? "Book marked for review by Library Director."
                            : "Book successfully marked for weeding.",
                        "success"
                    );
                    refetch();
                },
                onError: (err) => {
                    showSnackbar(`Failed to process weeding: ${err.message}`, "error");
                },
            });
        }
    };

    const finalizeArchiving = (bookWeedingStatusNotes: string) => {
        if (currentWeedInfo) {
            const updatedWeedInfo = { ...currentWeedInfo, bookWeedingStatusNotes, weedStatus: "ARCHIVED" };
            archiveBook(updatedWeedInfo, {
                onSuccess: () => {
                    showSnackbar("Book successfully archived.", "success");
                    refetch();
                },
                onError: (err) => {
                    showSnackbar(`Failed to archive book: ${err.message}`, "error");
                },
            });
        }
    };

    const finalizeProcess = (bookWeedingStatusNotes: string) => {
        if (currentWeedInfo) {
            finalizeWeedingProcess(
                { weedProcessId: currentWeedInfo.weedProcessId, notes: bookWeedingStatusNotes },
                {
                    onSuccess: () => {
                        showSnackbar("Weeding process successfully finalized.", "success");
                        setAllProcessed(false);
                        refetch();
                    },
                    onError: (err) => {
                        showSnackbar(`Failed to finalize process: ${err.message}`, "error");
                    },
                }
            );
        }
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
                        onClick={() => navigate(PROTECTED_ROUTES.WEEDINGCRITERIA)}
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
            {currentWeedInfo && (
                <ReviewModal
                    open={openModal}
                    handleClose={handleCloseModal}
                    onConfirm={
                        isArchiving
                            ? finalizeArchiving
                            : allProcessed
                                ? finalizeProcess
                                : isOverride
                                    ? (notes) => {
                                        if (currentWeedInfo) {
                                            const updatedWeedInfo = {
                                                ...currentWeedInfo,
                                                bookWeedingStatusNotes: notes,
                                                weedStatus: "KEPT",
                                            };
                                            overrideWeeding(updatedWeedInfo, {
                                                onSuccess: () => {
                                                    showSnackbar("Book successfully kept.", "success");
                                                    refetch();
                                                },
                                                onError: (err) => {
                                                    showSnackbar(`Failed to keep book: ${err.message}`, "error");
                                                },
                                            });
                                        }
                                    }
                                    : handleWeedBook
                    }
                    weedInfo={currentWeedInfo}
                    isOverride={isOverride}
                    processNotes={processNotes}
                    setProcessNotes={setProcessNotes}
                    isFinalizingProcess={allProcessed}
                    isArchiving={isArchiving}
                />
            )}
        </>
    );
};

export default WeedingPage;