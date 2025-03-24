import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, Button, Box, List, ListItem, ListItemText, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Search } from "lucide-react";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { useFetchBookByQuery } from "./useFetchBookByQuery";
import { Loading } from "../../../../components";
import { CustomDialog } from "../../../../components";
import { AccountData } from "../../../../types";
import BookUserDetails from "../BookAndUserDetails";
import { useDialog } from "../../../../hooks/useDialog";
interface BorrowProps {
    accountData?: AccountData,
    onClose: () => void;
}

const Borrow: React.FC<BorrowProps> = ({ accountData, onClose }) => {
    const showSnackbar = useSnackbarContext();
    const { closeDialog, isOpen, openDialog } = useDialog()
    const [showBorrow, setShowBorrow] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { isLoading, data: books, error } = useFetchBookByQuery(searchQuery);
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        if (books && books.length > 0 && searchQuery) {
            showSnackbar(`Successfully found ${books.length} copies`, "success");
        }
    }, [books, searchQuery, showSnackbar]);

    useEffect(() => {
        if (accountData && selectedBook && !isOpen && !confirmOpen) {
            setShowBorrow(false);
            openDialog();
        }
    }, [accountData, selectedBook, isOpen, openDialog, confirmOpen]);
    const handleSearch = () => {
        setSearchQuery(searchValue.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchValue.trim()) {
            handleSearch();
        }
    };

    const handleSelectBook = (book: any) => {
        setSelectedBook(book);
        setConfirmOpen(true);
    };

    const handleConfirmSelection = () => {
        setConfirmOpen(false);
    };

    const handleBookUserDetailsClose = () => {
        closeDialog();
        onClose();
    };

    const content = (
        <>
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr auto auto" }} gap={1} marginBottom="2px">
                <TextField
                    size="small"
                    label="Search by Title/ISBN/Accession Number"
                    variant="outlined"
                    fullWidth
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={15} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    size="small"
                    sx={{ width: { xs: "100%", sm: "150px" }, backgroundColor: "#d32f2f" }}
                    disabled={!searchValue.trim()}
                    onClick={handleSearch}
                >
                    Search
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ width: { xs: "100%", sm: "150px" }, color: "#d32f2f", borderColor: "#d32f2f" }}
                >
                    Scan Book QR
                </Button>
            </Box>
            {isLoading ? (
                <Box display="flex" justifyContent="center">
                    <Loading />
                </Box>
            ) : error ? (
                <Typography>Error fetching book references</Typography>
            ) : books?.length > 0 ? (
                <List>
                    {books.map((book, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={book.title} secondary={`Author(s): ${book.authors} Status: ${book.status}`} />
                            <Box display="flex" alignItems="center" gap={1}>
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                                    onClick={() => handleSelectBook(book)}
                                >
                                    Select Book
                                </Button>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            ) : searchQuery ? (
                <Typography>No book found</Typography>
            ) : null}
        </>
    );

    return (
        <>
            {showBorrow && (
                <CustomDialog
                    open={true}
                    title={`Select the Book to Borrow`}
                    onClose={onClose}
                    content={content}
                />
            )}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Selection</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to select "{selectedBook?.title}"?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} sx={{ color: "#d32f2f" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSelection} sx={{ color: "#d32f2f" }} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {isOpen && (
                <BookUserDetails
                    account_id={accountData?.account_id}
                    user_id={accountData?.user_id}
                    bookData={selectedBook}
                    onClose={handleBookUserDetailsClose}
                />
            )}
        </>
    );
};

export default Borrow;