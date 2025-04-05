import { useState, useEffect } from "react";
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";
import { useRecordNewLoan } from "../../../pages/Circulation/Dialog/BookAndUserDetails/useRecordNewLoan";
import { Loan } from "../../../types"; import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";
import { Books } from "../../../types";

interface ActionButtonsProps {
    role: string | null;
    book?: Books;
    acquisitionData?: unknown;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ role, book, acquisitionData }) => {
    const showSnackbar = useSnackbarContext();
    const location = useLocation();
    const book = location.state?.book || JSON.parse(sessionStorage.getItem("book") || "null");
    const user_id = localStorage.getItem("id");

    const { recordLoan, isPending, error } = useRecordNewLoan();
    const [dialogOpen, setDialogOpen] = useState(false);


    const handleConfirm = () => {
        if (!user_id || !book) {
            showSnackbar("Missing user or book data", "error");
            return;
        }

        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 8);
        const formattedLoanDate = now.toISOString().slice(0, 19);

        const newLoan: Loan = {
            book_id: book.id,
            book_accession_no: book.accessionNumber,
            book_title: book.title,
            user_id: user_id,
            loanDate: formattedLoanDate,
        };

        recordLoan(newLoan, {
            onSuccess: () => {
                showSnackbar("Book successfully borrowed!", "success");
                setDialogOpen(false);
            },
            onError: (error) => {
                showSnackbar(`${error}`, "error");
                setDialogOpen(false);
            },
        });
    };

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);

    const navigate = useNavigate();
    const handleCatalogClick = () => {
        navigate(PROTECTED_ROUTES.CATALOG, {
            state: {
                googleBookApiData: book,
                acquisitionData
            }
        });
    };
    return (
        <>
            <Box display="flex" gap={2} mt={1} mb={2}>
                {role === "STUDENT" ? (
                    <>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "#d32f2f" }}
                            onClick={handleOpenDialog}
                            disabled={isPending}
                        >
                            Borrow
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                        >
                            Reserve
                        </Button>
                    </>
                ) : (
                    <Button variant="contained" onClick={handleCatalogClick} sx={{ backgroundColor: "#d32f2f" }}>
                        Catalog
                    </Button>
                )}
            </Box>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Borrow</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to borrow the book:{" "}
                        <strong>{book?.title || "Unknown Title"}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        color="primary"
                        disabled={isPending}
                    >
                        {isPending ? "Borrowing..." : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ActionButtons;