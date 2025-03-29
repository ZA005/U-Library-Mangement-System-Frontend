import React, { useState, useEffect } from "react";
import { Button, TextField, Box, } from "@mui/material";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { CustomDialog } from "../../../../components";
import { useAddReservation } from "./useAddReservation";
import { Books, Reservation } from "../../../../types";

interface ConfirmReservationProps {
    bookData: Books;
    account_id: number;
    user_id: string;
    refetchReservations: () => void;
    onClose: () => void;
}

const ConfirmReservation: React.FC<ConfirmReservationProps> = ({ bookData, account_id, user_id, refetchReservations, onClose }) => {
    const [reservation, setReservation] = useState<Reservation | null>(null);

    const showSnackbar = useSnackbarContext();

    useEffect(() => {
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 8);
        const formattedTime = now.toISOString().slice(0, 19);

        setReservation({
            book_id: bookData.id,
            book_title: bookData.title,
            book_accession_no: bookData.accessionNumber,
            account_id: account_id,
            user_id: user_id,
            reservationDateTime: formattedTime
        });
    }, [bookData, account_id, user_id, reservation]);

    const content = (
        <>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr" },
                    gap: "10px"
                }}
            >
                <TextField size="small" fullWidth label="Title" name="title" value={bookData.title} disabled />
                <TextField size="small" fullWidth label="Accession Number" name="Accession Number" value={bookData.accessionNumber} disabled />
                <TextField size="small" fullWidth label="ISBN10" name="ISBN10" value={bookData.isbn10} disabled />
                <TextField size="small" fullWidth label="ISBN13" name="ISBN13" value={bookData.isbn13} disabled />
                <TextField size="small" fullWidth label="Author(s)" name="Author(s)" value={bookData.authors} disabled />
                <TextField size="small" fullWidth label="Edition" name="Edition" value={bookData.edition} disabled />
                <TextField size="small" fullWidth label="Borrower ID" name="Borrower ID" value={user_id} disabled />
                <TextField size="small" fullWidth label="Reservation Time and Date" name="Reservation Time and Date" value={reservation?.reservationDateTime || ""} disabled />
            </Box>
        </>
    );

    const { addReservation } = useAddReservation()

    const handleConfirmReservation = () => {
        if (!reservation) {
            showSnackbar("Loan data is missing.", "error");
            return;
        }

        addReservation(reservation, {
            onSuccess: () => {
                showSnackbar("Successfully recorded new loan!", "success");
                refetchReservations()
                onClose();
            },
            onError: (error) => {
                showSnackbar(`Error: ${error}`, "error");
            },
        });
    };

    const actions = (
        <Button
            onClick={handleConfirmReservation}
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#EA4040" }}
        >
            Confirm
        </Button>
    );


    return (
        <CustomDialog
            open={true}
            title={`Confirm Reservation`}
            onClose={onClose}
            content={content}
            dialogSize="xs"
            actions={actions}
        />
    );
};

export default ConfirmReservation;
