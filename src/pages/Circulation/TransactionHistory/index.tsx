import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Box } from "@mui/material";
import { PageTitle, Dropdown, DynamicTable } from "../../../components";
import { useFetchTransactionHistory } from "./useFetchTransactionHistory";
import { Menu } from "lucide-react";
const TransactionHistory: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Transaction History - Library Management System");
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

    const { isLoading, data: TransactionHistory = [], error } = useFetchTransactionHistory();
    const [selectedOption, setSelectedOption] = useState("");

    /////////////////////////////////////////////////////////////////////////////////////

    const columns = [
        { key: "transDateTime", label: "DATE" },
        { key: "user_id", label: "USER ID" },
        { key: "type", label: "TYPE" },
    ]

    const options = [
        { id: 1, name: "LOAN" },
        { id: 2, name: "RETURNED" },
        { id: 3, name: "RENEWED" },
        { id: 4, name: "RESERVATION" },
        { id: 5, name: "FINE_PAYMENT" },
        { id: 6, name: "OVERDUE" },
    ]

    return (
        <>
            <PageTitle title="Transaction History" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }}
                    width={{ xs: "100%", md: "800px" }}
                    alignItems="center"
                    gap={2}
                >
                    <Dropdown
                        menuSize="small"
                        label="Filter By"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        options={options}
                    />
                </Box>
                <Box mt={4}>
                    <DynamicTable
                        columns={columns}
                        data={TransactionHistory}
                        loading={isLoading}
                        error={error}
                    />
                </Box>
            </Container>
        </>
    )
}

export default TransactionHistory