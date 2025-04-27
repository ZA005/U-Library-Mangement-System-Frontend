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
import ReviewModal from "./Dialog/Dialog";
import { useWeedBook } from "./Dialog/useWeedBook";
import { useArchiveBook } from "./Dialog/useArchiveBook";
import { useFinalizeWeedingProcess } from "./Dialog/useFinalizeWeedingProcess";
import { useOverrideWeeding } from "./Dialog/useOverrideWeeding";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";
import ConfirmationDialog from "../WeedingCriteria/Dialog";
import { useQueryClient } from "@tanstack/react-query";
import renderActionBasedOnStatus from "./redenderActionBasedOnStatus";

const WeedingPage: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const { role } = useAuth();
    const navigate = useNavigate();
    const showSnackbar = useSnackbarContext();
    const queryClient = useQueryClient();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openArchiveDialog, setOpenArchiveDialog] = useState<boolean>(false);
    const { isLoading, data, error: fetchError, refetch } = useFetchFlaggedBooks();
    const flaggedBooks = React.useMemo(() => (Array.isArray(data) ? data : []), [data]);
    const [weedInfos, setWeedInfos] = useState<WeedingInfo[]>([]);
    const [currentWeedInfo, setCurrentWeedInfo] = useState<WeedingInfo | null>(null);
    const [isOverride, setIsOverride] = useState<boolean>(false);
    const [isArchiving, setIsArchiving] = useState<boolean>(false);
    const [processNotes, setProcessNotes] = useState<string>("");
    const [allProcessed, setAllProcessed] = useState<boolean>(false);
    const [archiveNotes, setArchiveNotes] = useState<string>("");
    const [filter, setFilter] = useState<{ criteria?: string; accessionNumber?: string; status: string }>({
        status: role === "ADMIN" ? "REVIEWED" : "FLAGGED",
    });
    const { initiateWeeding, isLoading: isInitiating } = useFetchAddFlaggedBooks();

    const { mutate: weedBook, error: weedError, isPending: isWeeding } = useWeedBook();
    const { mutate: overrideWeeding, error: overrideError } = useOverrideWeeding();
    const { mutate: archiveBook, error: archiveError, isPending: isArchivingBook } = useArchiveBook();
    const { mutate: finalizeWeedingProcess, error: finalizeError } = useFinalizeWeedingProcess();

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
        console.log("flaggedBooks:", flaggedBooks);
        // Validate WeedingInfo objects
        const validBooks = flaggedBooks.filter(
            (book) => book?.id && book?.bookTitle && book?.weedStatus
        );
        if (flaggedBooks.length !== validBooks.length) {
            console.warn("Invalid WeedingInfo objects detected:", flaggedBooks);
            showSnackbar("Some books have invalid data. Please check the data source.", "warning");
        }
        setWeedInfos(validBooks);
    }, [flaggedBooks, showSnackbar]);

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
        if (!weedInfo?.id || !weedInfo?.bookTitle) {
            console.error("Invalid WeedingInfo:", weedInfo);
            showSnackbar("Cannot open modal: Invalid book data.", "error");
            return;
        }
        console.log("handleOpenModal: weedInfo =", weedInfo);
        setCurrentWeedInfo(weedInfo);
        setIsOverride(override);
        setIsArchiving(archiving);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsOverride(false);
        setIsArchiving(false);
        // Preserve currentWeedInfo for archive dialog
        setArchiveNotes("");
    };

    const handleCloseArchiveDialog = () => {
        setOpenArchiveDialog(false);
        setArchiveNotes("");
        // Reset currentWeedInfo only if no mutation is pending
        if (!isWeeding && !isArchivingBook) {
            setCurrentWeedInfo(null);
        }
    };

    const onOverrideWeeding = (bookId: number) => {
        const bookToOverride = weedInfos.find((book) => book.id === bookId);
        if (bookToOverride) {
            handleOpenModal(bookToOverride, true);
        } else {
            showSnackbar("Book not found for overriding.", "error");
        }
    };

    const handleWeedBook = (bookWeedingStatusNotes: string) => {
        if (!currentWeedInfo) {
            console.error("handleWeedBook: currentWeedInfo is null");
            showSnackbar("No book selected for weeding.", "error");
            return;
        }

        console.log("handleWeedBook: currentWeedInfo =", currentWeedInfo);
        const newStatus = role === "LIBRARIAN" ? "REVIEWED" : "WEEDED";
        const updatedWeedInfo = { ...currentWeedInfo, bookWeedingStatusNotes, weedStatus: newStatus };

        if (role === "ADMIN" && newStatus === "WEEDED") {
            setArchiveNotes(bookWeedingStatusNotes);
            setOpenArchiveDialog(true);
            setOpenModal(false);
        } else {
            weedBook(updatedWeedInfo, {
                onSuccess: () => {
                    showSnackbar(
                        newStatus === "REVIEWED"
                            ? "Book marked for review by Library Director."
                            : "Book successfully marked for weeding.",
                        "success"
                    );
                    handleCloseModal();
                    setCurrentWeedInfo(null);
                    queryClient.invalidateQueries({ queryKey: ["flaggedBooks"] });
                    refetch();
                },
                onError: (err) => {
                    showSnackbar(`Failed to process weeding: ${err.message}`, "error");
                },
            });
        }
    };

    const handleConfirmArchive = () => {
        if (!currentWeedInfo) {
            console.error("handleConfirmArchive: currentWeedInfo is null");
            showSnackbar("No book selected for archiving.", "error");
            return;
        }

        const updatedWeedInfo = { ...currentWeedInfo, bookWeedingStatusNotes: archiveNotes, weedStatus: "ARCHIVED" };
        archiveBook(updatedWeedInfo, {
            onSuccess: () => {
                showSnackbar("Book successfully archived.", "success");
                handleCloseArchiveDialog();
                setCurrentWeedInfo(null);
                queryClient.invalidateQueries({ queryKey: ["flaggedBooks"] });
                refetch();
            },
            onError: (err) => {
                showSnackbar(`Failed to archive book: ${err.message}`, "error");
            },
        });
    };

    const handleConfirmWeed = () => {
        if (!currentWeedInfo) {
            console.error("handleConfirmWeed: currentWeedInfo is null");
            showSnackbar("No book selected for weeding.", "error");
            return;
        }

        const updatedWeedInfo = { ...currentWeedInfo, bookWeedingStatusNotes: archiveNotes, weedStatus: "WEEDED" };
        weedBook(updatedWeedInfo, {
            onSuccess: () => {
                showSnackbar("Book successfully marked for weeding.", "success");
                handleCloseArchiveDialog();
                setCurrentWeedInfo(null);
                queryClient.invalidateQueries({ queryKey: ["flaggedBooks"] });
                refetch();
            },
            onError: (err) => {
                showSnackbar(`Failed to process weeding: ${err.message}`, "error");
            },
        });
    };

    const finalizeArchiving = (bookWeedingStatusNotes: string) => {
        if (!currentWeedInfo) {
            console.error("finalizeArchiving: currentWeedInfo is null");
            showSnackbar("No book selected for archiving.", "error");
            return;
        }

        const updatedWeedInfo = { ...currentWeedInfo, bookWeedingStatusNotes, weedStatus: "ARCHIVED" };
        archiveBook(updatedWeedInfo, {
            onSuccess: () => {
                showSnackbar("Book successfully archived.", "success");
                handleCloseModal();
                setCurrentWeedInfo(null);
                queryClient.invalidateQueries({ queryKey: ["flaggedBooks"] });
                refetch();
            },
            onError: (err) => {
                showSnackbar(`Failed to archive book: ${err.message}`, "error");
            },
        });
    };

    const finalizeProcess = (bookWeedingStatusNotes: string) => {
        if (!currentWeedInfo) {
            console.error("finalizeProcess: currentWeedInfo is null");
            showSnackbar("No book selected for finalizing.", "error");
            return;
        }

        finalizeWeedingProcess(
            { weedProcessId: currentWeedInfo.weedProcessId, notes: bookWeedingStatusNotes },
            {
                onSuccess: () => {
                    showSnackbar("Weeding process successfully finalized.", "success");
                    setAllProcessed(false);
                    handleCloseModal();
                    setCurrentWeedInfo(null);
                    queryClient.invalidateQueries({ queryKey: ["flaggedBooks"] });
                    refetch();
                },
                onError: (err) => {
                    showSnackbar(`Failed to finalize process: ${err.message}`, "error");
                },
            }
        );
    };

    const initiateWeedingProcess = () => {
        const initiator = role || "SYSTEM";
        initiateWeeding(initiator, {
            onSuccess: () => {
                showSnackbar("Weeding process initiated successfully.", "success");
                queryClient.invalidateQueries({ queryKey: ["flaggedBooks"] });
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
                                        if (!currentWeedInfo) {
                                            console.error("overrideWeeding: currentWeedInfo is null");
                                            showSnackbar("No book selected for overriding.", "error");
                                            return;
                                        }
                                        const updatedWeedInfo = {
                                            ...currentWeedInfo,
                                            bookWeedingStatusNotes: notes,
                                            weedStatus: "KEPT",
                                        };
                                        overrideWeeding(updatedWeedInfo, {
                                            onSuccess: () => {
                                                showSnackbar("Book successfully kept.", "success");
                                                handleCloseModal();
                                                setCurrentWeedInfo(null);
                                                queryClient.invalidateQueries({ queryKey: ["flaggedBooks"] });
                                                refetch();
                                            },
                                            onError: (err) => {
                                                showSnackbar(`Failed to keep book: ${err.message}`, "error");
                                            },
                                        });
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
            <ConfirmationDialog
                open={openArchiveDialog && !!currentWeedInfo} // Only open if currentWeedInfo is set
                onClose={handleCloseArchiveDialog}
                onConfirm={handleConfirmArchive}
                onCancel={handleConfirmWeed}
                title="Archive Book?"
                message={
                    currentWeedInfo?.bookTitle
                        ? `Would you like to archive the book "${currentWeedInfo.bookTitle}" instead of weeding it?`
                        : "Would you like to archive this book instead of weeding it?"
                }
                confirmText="Archive"
                cancelText="Weed"
                isSubmitting={isWeeding || isArchivingBook}
            />
        </>
    );
};

export default WeedingPage;