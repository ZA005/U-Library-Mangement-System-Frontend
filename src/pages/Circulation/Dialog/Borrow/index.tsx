import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, Button, Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Search } from "lucide-react";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { useFetchBookByQuery } from "./useFetchBookByQuery";
import { Loading } from "../../../../components";
import { CustomDialog } from "../../../../components";
import { AccountData } from "../../../../types";
interface BorrowProps {
    accountData?: AccountData,
    onClose: () => void;
}

const Borrow: React.FC<BorrowProps> = ({ accountData, onClose }) => {
    const showSnackbar = useSnackbarContext();
    const [searchValue, setSearchValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { isLoading, data: books, error, refetch } = useFetchBookByQuery(searchQuery);

    useEffect(() => {
        if (books && books.length > 0 && searchQuery) {
            showSnackbar(`Successfully found ${books.length} copies`, "success");
        }
    }, [books, searchQuery, showSnackbar]);

    const handleSearch = () => {
        setSearchQuery(searchValue.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchValue.trim()) {
            handleSearch();
        }
    };

    const content = (
        <>
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", sm: "1fr auto auto" }}
                gap={1}
                marginBottom="2px"
            >
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
                    sx={{
                        width: { xs: "100%", sm: "150px" },
                        backgroundColor: "#d32f2f"
                    }}
                    disabled={!searchValue.trim()}
                    onClick={handleSearch}
                >
                    Search
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{
                        width: { xs: "100%", sm: "150px" },
                        color: "#d32f2f",
                        borderColor: "#d32f2f"
                    }}
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
                            <ListItemText
                                primary={book.title}
                                secondary={`Author(s): ${book.authors} Status: ${book.status}`}
                            />
                            <Box display="flex" alignItems="center" gap={1}>
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                                    onClick={() => { console.log("BOOK DATA:", book) }}
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
    )
    return (
        <>
            <CustomDialog
                open={true}
                title={`Select the Book to Borrow for User ${accountData.user_id}`}
                onClose={onClose}
                content={content}
            />
        </>
    );
}

export default Borrow;