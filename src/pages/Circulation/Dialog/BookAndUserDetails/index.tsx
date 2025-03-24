import React, { useState, useEffect } from "react";
import { Button, TextField, Box, } from "@mui/material";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { CustomDialog } from "../../../../components";
import { Books, Loan } from "../../../../types";
import { useRecordNewLoan } from "./useRecordNewLoan";

interface BookUserDetailsProps {
    bookData: Books;
    account_id: number;
    user_id: string;
    onClose: () => void;
}

const BookUserDetails: React.FC<BookUserDetailsProps> = ({ bookData, account_id, user_id, onClose }) => {
    const [loan, setLoan] = useState<Loan | null>(null);

    const showSnackbar = useSnackbarContext();

    useEffect(() => {
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 8);
        const formattedTime = now.toISOString().slice(0, 19);

        setLoan({
            id: 0,
            book_id: bookData.id,
            book_accession_no: bookData.accessionNumber,
            book_title: bookData.title,
            account_id: account_id,
            user_id: user_id,
            email: "",
            firstName: "",
            middleName: "",
            lastName: "",
            suffix: "",
            role: "",
            loanDate: formattedTime,
            dueDate: "",
            returnDate: "",
        });
    }, [bookData, account_id, user_id, loan]);

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
                <TextField size="small" fullWidth label="Loan Time and Date" name="Loan Time and Date" value={loan?.loanDate || ""} disabled />
            </Box>
        </>
    );
    const { recordLoan } = useRecordNewLoan();

    const handleConfirmLoan = () => {
        if (!loan) {
            showSnackbar("Loan data is missing.", "error");
            return;
        }

        recordLoan(loan, {
            onSuccess: () => {
                showSnackbar("Successfully recorded new loan!", "success");
                onClose();
            },
            onError: (error) => {
                showSnackbar(`Error: ${error}`, "error");
            },
        });
    };

    const actions = (
        <Button
            onClick={handleConfirmLoan}
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
            title={`Borrow Details`}
            onClose={onClose}
            content={content}
            dialogSize="xs"
            actions={actions}
        />
    );
};

export default BookUserDetails;
