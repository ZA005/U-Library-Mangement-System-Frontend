import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Box } from "@mui/material";
import { PageTitle, DynamicTable, DynamicTableCell } from "../../../components";
import { useFetchNonPaidFines } from "./useFetchNonPaidFine";
import { convertJsonDateAndTime } from "../../../utils/convert";
import { Menu } from "lucide-react";
import { Fine } from "../../../types";

const OverseeOverdues: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Oversee Overdues - Library Management System");
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

    const { isLoading, data: nonPaidFines = [], error, refetch } = useFetchNonPaidFines();

    /////////////////////////////////////////////////////////////////////////////////////

    const columns = [
        { key: "user_id", label: "ID" },
        { key: "fullName", label: "Name" },
        { key: "loanDate", label: "Date Borrowed", render: (row: any) => convertJsonDateAndTime.formatDateTime(row.loanDate) },
        { key: "dueDate", label: "Due Date", render: (row: any) => convertJsonDateAndTime.formatDateTime(row.dueDate) },
        { key: "fine_amount", label: "Penalty Amount", render: (row: any) => row.fine_amount.toFixed(2) },
        {
            key: "action",
            label: "",
            render: (row: Fine) => (
                <DynamicTableCell
                    type="button"
                    buttonText="Mark as Paid"
                    onAction={() => { }}
                />
            )
        }
    ]

    /////////////////////////////////////////////////////////////////////////////////////

    return (

        <>
            <PageTitle title="Oversee Overdues" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <DynamicTable
                    columns={columns}
                    data={nonPaidFines}
                    loading={isLoading}
                    error={error}
                />
            </Container>
        </>
    )
}

export default OverseeOverdues