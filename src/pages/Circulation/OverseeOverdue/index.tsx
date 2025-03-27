import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { PageTitle, DynamicTable, DynamicTableCell } from "../../../components";
import { useFetchNonPaidFines } from "./useFetchNonPaidFine";
import { useMarkAsPaid } from "./useMarkAsPaid";
import { useDialog } from "../../../hooks/useDialog";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";
import { convertJsonDateAndTime } from "../../../utils/convert";
import { Menu } from "lucide-react";
import { Fine } from "../../../types";

const OverseeOverdues: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Oversee Overdues - Library Management System");
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

    const { isLoading, data: nonPaidFines = [], error, refetch } = useFetchNonPaidFines();
    const { markAsPaid, error: errorPaying } = useMarkAsPaid();
    const showSnackbar = useSnackbarContext();

    const { isOpen, openDialog, closeDialog } = useDialog();
    const [selectedFine, setSelectedFine] = useState<Fine | null>(null);

    /////////////////////////////////////////////////////////////////////////////////////
    const handleConfirmPayment = () => {
        if (selectedFine) {
            markAsPaid(selectedFine.id, {
                onSuccess: () => {
                    showSnackbar("Successfully paid the overdue fee!");
                    refetch();
                },
                onError: (errorPaying) => showSnackbar(`${errorPaying}`, "error"),
            });
        }
        closeDialog();
    };

    const handleOpenDialog = (fine: Fine) => {
        setSelectedFine(fine);
        openDialog();
    };
    /////////////////////////////////////////////////////////////////////////////////////
    const columns = [
        { key: "user_id", label: "ID" },
        { key: "fullName", label: "Name" },
        { key: "loanDate", label: "Date Borrowed", render: (row: any) => convertJsonDateAndTime.formatDateTime(row.loanDate) },
        { key: "dueDate", label: "Due Date", render: (row: any) => convertJsonDateAndTime.formatDateTime(row.dueDate) },
        { key: "fine_amount", label: "Penalty Amount", render: (row: any) => row.fine_amount.toFixed(2) },
        {
            key: "action",
            label: "",
            render: (row: Fine) => (
                <DynamicTableCell
                    type="button"
                    buttonText="Mark as Paid"
                    onAction={() => { handleOpenDialog(row) }}
                />
            )
        }
    ]

    /////////////////////////////////////////////////////////////////////////////////////

    return (

        <>
            <PageTitle title="Oversee Overdues" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <DynamicTable
                    columns={columns}
                    data={nonPaidFines}
                    loading={isLoading}
                    error={error}
                />
            </Container>

            <Dialog open={isOpen} onClose={closeDialog}>
                <DialogTitle>Confirm Payment</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to mark this fine as paid?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={closeDialog} sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}>Cancel</Button>
                    <Button variant="contained" onClick={handleConfirmPayment} autoFocus sx={{ backgroundColor: "#d32f2f" }}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default OverseeOverdues