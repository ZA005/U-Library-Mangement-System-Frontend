import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Box, Button } from "@mui/material";
import { PageTitle, DynamicTable, Identification } from "../../../components";
import { useModal } from "../../../hooks/Modal/useModal";
import { convertJsonDateAndTime } from "../../../utils/convert";
import { Menu } from "lucide-react";
const Reservation: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Manage Reservation - Library Management System");
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

    const { close, isOpen, open } = useModal()

    const handleReserveBook = () => {
        open()
    }




    const columns = [
        { key: "book_accession_no", label: "Accession #" },
        { key: "book_title", label: "Title" },
        { key: "user_id", label: "User ID" },
        { key: "reservationDateTime", label: "Reservation Timestamp", render: (row: any) => convertJsonDateAndTime.formatDateTime(row.transDateTime) },
        { key: "expirationDate", label: "Expiration", render: (row: any) => convertJsonDateAndTime.formatDateTime(row.transDateTime) },
        { key: "status", label: "Status" },
    ]

    return (
        <>
            <PageTitle title="Manage Reservation" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }}
                    width={{ xs: "100%", md: "800px" }}
                    alignItems="center"
                    gap={2}
                >
                    <Button
                        variant="contained"
                        onClick={handleReserveBook}
                        sx={{
                            width: { xs: "100%", md: "200px" },
                            backgroundColor: "#d32f2f",
                            "&:disabled": {
                                backgroundColor: "#b71c1c",
                            },
                        }}>
                        New Reservation
                    </Button>
                </Box>
                <Box mt={4}>

                </Box>
            </Container>
            {
                isOpen && (
                    <Identification
                        onClose={close}
                        type="RESERVATION"
                        refetchLoans={() => { }}
                    />
                )
            }
        </>
    )
}

export default Reservation