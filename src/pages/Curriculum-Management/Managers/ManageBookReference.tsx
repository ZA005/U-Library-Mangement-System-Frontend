import React, { useState, useEffect } from "react";
import { Box, Container, IconButton, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../components/Header/Header";
import Line from "../../../components/Line/Line";
import Copyright from "../../../components/Footer/Copyright";
import Sidebar from "../../../components/Sidebar";
import { getAllBookRef, BookReference } from "../../../services/Curriculum/BookReferenceService";
import UpdateBookReferenceModal from "../../../components/CurriculumManagement/UpdateBookReferenceModal";
import styles from "./styles.module.css";

const ManageBookReference: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [bookReferences, setBookReferences] = useState<BookReference[]>([]);
    const [selectedBookReference, setSelectedBookReference] =
        useState<BookReference | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchBookReferences = async () => {
            try {
                const data = await getAllBookRef();
                console.log('DATA', data)
                setBookReferences(data);
            } catch (error) {
                console.error("Error fetching book references:", error);
            }
        };

        fetchBookReferences();
    }, []);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    const refreshList = async () => {
        try {
            const data = await getAllBookRef();
            setBookReferences(data);
        } catch (error) {
            console.error("Error refreshing book references:", error);
        }
    };

    const handleEditClick = (bookReference: BookReference) => {
        setSelectedBookReference(bookReference);
        setOpenUpdateModal(true);
    };

    const filteredBookReferences = bookReferences.filter((bookReference) =>
        bookReference.book_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookReference.subject_name.toLowerCase().includes(searchTerm.toLowerCase())

    );

    return (
        <Box className={styles.rootContainer}>
            <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />
            <Container maxWidth="lg" className={styles.container}>
                <Header
                    buttons={
                        <IconButton onClick={toggleSidebar}>
                            <MenuIcon className={styles.menuIcon} />
                        </IconButton>
                    }
                />
                <Typography variant="h4" gutterBottom className={styles.title}>
                    Manage Book References
                </Typography>

                <Line />

                <Box className={styles.actionBar}>
                    <Box className={styles.searchBox}>
                        <TextField
                            placeholder="Search..."
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon className={styles.searchIcon} />,
                            }}
                        />
                    </Box>
                </Box>

                <TableContainer
                    component={Paper}
                    className={styles.tableContainer}
                    sx={{ maxHeight: "60vh", overflowY: "auto" }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Book Title</TableCell>
                                <TableCell>Subject Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookReferences.length > 0 ? (
                                filteredBookReferences.map((bookReference) => (
                                    <TableRow key={bookReference.id}>
                                        <TableCell>{bookReference.book_name}</TableCell>
                                        <TableCell>{bookReference.subject_name}</TableCell>
                                        <TableCell>
                                            {bookReference.status === 1 ? "Active" : "Inactive"}
                                        </TableCell>
                                        <TableCell>
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
                                                onClick={() => handleEditClick(bookReference)}
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body1" sx={{ color: "gray" }}>
                                            No book references match your search criteria.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            <UpdateBookReferenceModal
                open={openUpdateModal}
                handleClose={() => setOpenUpdateModal(false)}
                onBookReferenceUpdate={refreshList}
                bookReference={selectedBookReference}
            />
            <Copyright />
        </Box>
    );
};

export default ManageBookReference
