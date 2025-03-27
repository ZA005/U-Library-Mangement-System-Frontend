import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box, Button, TextField, InputAdornment } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, DynamicTableCell, Identification } from "../../../components";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
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
    const { isOpen, close, open } = useModal();
    const [searchQuery, setSearchQuery] = useState("");

    /////////////////////////////////////////////////////////////////////////////////////

    const handleNewBorrow = () => {
        open()
    }

    /////////////////////////////////////////////////////////////////////////////////////

    const { isLoading, data: loans = [], error, refetch } = useFetchUnreturnedLoan()

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
                    onAction={(value) => { }}
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
            {isOpen && (
                <Identification onClose={close} />
            )}
        </>
    )
}

export default ManageCirculation