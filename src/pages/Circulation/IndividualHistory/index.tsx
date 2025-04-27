import React, { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Box } from "@mui/material";
import { useFetchIndividualTransactionHistory } from "./useFetchIndividualHistory";
import { PageTitle, DynamicTable } from "../../../components";
import { convertJsonDateAndTime } from "../../../utils/convert";
import { useAuth } from "../../../contexts/AuthContext";
import { Menu } from "lucide-react";

const IndividualBorrowHistory: React.FC = () => {
    const { id } = useAuth()
    const { data: transactions = [], error, isLoading } = useFetchIndividualTransactionHistory(id!);
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

    const columns = [
        { key: "transDateTime", label: "DATE", render: (row: any) => convertJsonDateAndTime.formatDateTime(row.transDateTime) },
        { key: "user_id", label: "USER ID" },
        { key: "type", label: "TYPE" },
    ]

    return (
        <>
            <PageTitle title="Transaction History" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>

                <Box mt={4}>
                    <DynamicTable
                        columns={columns}
                        data={transactions}
                        loading={isLoading}
                        error={error}
                    />
                </Box>
            </Container>
        </>
    )
}

export default IndividualBorrowHistory