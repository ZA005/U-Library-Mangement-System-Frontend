import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box, Button, TextField, InputAdornment, Modal, Typography, Paper } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, DynamicTableCell, Identification } from "../../../components";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";
import { useReturnLoan } from "./useReturnLoan";
import { useRenewLoan } from "./useRenewLoan";
import { useFetchUnreturnedLoan } from "./useFetchUnreturnedLoans";
import { convertJsonDateAndTime } from "../../../utils/convert";
import { useModal } from "../../../hooks/Modal/useModal";
import { Loan } from "../../../types";
import { Menu, Search } from "lucide-react";

const ManageCirculation: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Manage Circulation - Library Management System");
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

    /////////////////////////////////////////////////////////////////////////////////////
    const showSnackbar = useSnackbarContext()
    const { isOpen: IdentificationOpen, close: closeIdentification, open: openIdentification } = useModal();
    const { isOpen: ReturnRenewOpen, close, open } = useModal();
    const [dialogState, setDialogState] = useState<{ loan: Loan | null; action: "return" | "renew" | null }>({
        loan: null,
        action: null,
    });
    const [searchQuery, setSearchQuery] = useState("");

    /////////////////////////////////////////////////////////////////////////////////////

    const handleNewBorrow = () => {
        openIdentification()
    }

    /////////////////////////////////////////////////////////////////////////////////////

    const { isLoading, data: loans = [], error, refetch } = useFetchUnreturnedLoan()
    const { returnLoan, error: errorReturnLoan } = useReturnLoan();
    const { renewLoan, error: errorRenewingLoan } = useRenewLoan();
    /////////////////////////////////////////////////////////////////////////////////////

    const handleAction = (action: "return" | "renew", loan: Loan) => {
        setDialogState({ loan, action });
        open()
    };

    const handleConfirm = () => {
        if (!dialogState.loan || !dialogState.action) return;

        const actionFn = dialogState.action === "return" ? returnLoan : renewLoan;

        actionFn(dialogState.loan, {
            onSuccess: () => {
                showSnackbar(
                    `Book successfully ${dialogState.action === "return" ? "returned" : "renewed"}!`,
                    "success"
                );
                refetch();
            },
            onError: (error) => showSnackbar(`${error}`, "error"),
        });

        close()
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const refetchLoans = () => {
        refetch()
    }

    /////////////////////////////////////////////////////////////////////////////////////
    const columns = [
        { key: "book_accession_no", label: "Accession #" },
        { key: "book_title", label: "Book Title" },
        { key: "user_id", label: "User ID" },
        { key: "fullname", label: "Name" },
        { key: "loanDate", label: "Borrow Timestamp", render: (row: any) => convertJsonDateAndTime.formatDateTime(row.loanDate) },
        { key: "dueDate", label: "Due Timestamp", render: (row: any) => convertJsonDateAndTime.formatDateTime(row.dueDate) },
        {
            key: "action",
            label: "",
            render: (row: Loan) => (
                <DynamicTableCell
                    type="menu"
                    options={[
                        { value: "return", label: "Return" },
                        { value: "renew", label: "Renew" },
                    ]}
                    onAction={(value) => handleAction(value as "return" | "renew", row)}
                />
            )
        }
    ]
    return (
        <>
            <PageTitle title="Manage Circulation" />
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
                            onClick={handleNewBorrow}
                            sx={{
                                width: { xs: "100%", md: "200px" },
                                backgroundColor: "#d32f2f",
                                "&:disabled": {
                                    backgroundColor: "#b71c1c",
                                },
                            }}>
                            New Borrow
                        </Button>

                        <Button variant="outlined"
                            sx={{
                                width: { xs: "100%", md: "200px" },
                                color: "#d32f2f",
                                borderColor: "#d32f2f",
                                "&:disabled": {
                                    backgroundColor: "#b71c1c",
                                },
                            }}>
                            Pending
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

                <Box mt={4}>
                    <DynamicTable
                        columns={columns}
                        data={loans}
                        loading={isLoading}
                        error={error}
                    />
                </Box>
            </Container>
            {IdentificationOpen && (
                <Identification onClose={closeIdentification} refetchLoans={refetchLoans} />
            )}

            <Modal open={ReturnRenewOpen} onClose={close}>
                <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: 3, width: 300 }}>
                    <Typography variant="h6" gutterBottom>
                        Confirm {dialogState.action === "return" ? "Return" : "Renew"} Loan
                    </Typography>
                    <Typography>Are you sure you want to {dialogState.action} this loan?</Typography>
                    <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                        <Button onClick={handleConfirm} variant="contained" size="small" sx={{ backgroundColor: "#d32f2f" }}>
                            Confirm
                        </Button>
                        <Button onClick={close} variant="text" size="small" sx={{ color: "#d32f2f" }}>
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </>
    )
}

export default ManageCirculation