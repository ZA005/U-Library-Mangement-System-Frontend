import { useState } from "react";
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";
import { useRecordNewLoan } from "../../../pages/Circulation/Dialog/BookAndUserDetails/useRecordNewLoan";
import { useAddReservation } from "../../../pages/Circulation/Reservation/Dialog/useAddReservation";
import { Loan } from "../../../types"; import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";
import { useAuth } from "../../../contexts/AuthContext";
import { Books, Reservation } from "../../../types";

interface ActionButtonsProps {
    role: string | null;
    books?: Books;
    acquisitionData?: unknown;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ role, books, acquisitionData }) => {
    const { id } = useAuth();
    const showSnackbar = useSnackbarContext();
    const location = useLocation();
    const navigate = useNavigate();
    const book = location.state?.book || JSON.parse(sessionStorage.getItem("book") || "null");
    const user_id = localStorage.getItem("id");

    const { recordLoan, isPending: isBorrowPending } = useRecordNewLoan();
    const { addReservation, isPending: isReservePending } = useAddReservation()

    const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
    const [reserveDialogOpen, setReserveDialogOpen] = useState(false);

    const handleOpenBorrowDialog = () => setBorrowDialogOpen(true);
    const handleCloseBorrowDialog = () => setBorrowDialogOpen(false);

    const handleOpenReserveDialog = () => setReserveDialogOpen(true);
    const handleCloseReserveDialog = () => setReserveDialogOpen(false);

    const handleConfirmBorrow = () => {
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
                setBorrowDialogOpen(false);
                navigate(PROTECTED_ROUTES.BROWSE)

            },
            onError: (error) => {
                showSnackbar(`${error}`, "error");
                setBorrowDialogOpen(false);
            },
        });
    };

    const handleConfirmReserve = () => {
        if (!user_id || !book) {
            showSnackbar("Missing user or book data", "error");
            return;
        }

        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 8);
        const formattedReservationDate = now.toISOString().slice(0, 19);

        const newReservation: Reservation = {
            book_id: book.id,
            book_title: book.title,
            book_accession_no: book.accessionNumber,
            user_id: user_id,
            reservationDateTime: formattedReservationDate,
        };

        addReservation(newReservation, {
            onSuccess: () => {
                showSnackbar("Book successfully reserved!", "success");
                setReserveDialogOpen(false);
                navigate(PROTECTED_ROUTES.BROWSE)
            },
            onError: (error) => {
                showSnackbar(`${error}`, "error");
                setReserveDialogOpen(false);
            },
        });
    };

    const handleCatalogClick = () => {
        navigate(PROTECTED_ROUTES.CATALOG, {
            state: {
                googleBookApiData: book,
                acquisitionData
            }
        });
    };

    const isBorrowDisabled = isBorrowPending || book?.bookCatalog?.copies === 0;

    return (
        <>
            <Box display="flex" gap={2} mt={1} mb={2}>
                {(role === "LIBRARIAN" || role === "LIBRARYDIRECTOR") ? (
                    <Button
                        variant="contained"
                        onClick={handleCatalogClick}
                        sx={{ backgroundColor: "#d32f2f" }}
                    >
                        Catalog
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "#d32f2f" }}
                            onClick={handleOpenBorrowDialog}
                            disabled={isBorrowDisabled}
                        >
                            Borrow
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                            onClick={handleOpenReserveDialog}
                            disabled={isReservePending}
                        >
                            Reserve
                        </Button>
                    </>
                )}
            </Box>

            {/* Borrow Confirmation Dialog */}
            <Dialog open={borrowDialogOpen} onClose={handleCloseBorrowDialog}>
                <DialogTitle>Confirm Borrow</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to borrow the book:{" "}
                        <strong>{book?.title || "Unknown Title"}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBorrowDialog} disabled={isBorrowPending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmBorrow}
                        variant="contained"
                        color="primary"
                        disabled={isBorrowPending}
                    >
                        {isBorrowPending ? "Borrowing..." : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reserve Confirmation Dialog */}
            <Dialog open={reserveDialogOpen} onClose={handleCloseReserveDialog}>
                <DialogTitle>Confirm Reservation</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to reserve the book:{" "}
                        <strong>{book?.title || "Unknown Title"}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReserveDialog} disabled={isReservePending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmReserve}
                        variant="contained"
                        color="primary"
                        disabled={isReservePending}
                    >
                        {isReservePending ? "Reserving..." : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ActionButtons;