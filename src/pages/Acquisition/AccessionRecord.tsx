/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box } from "@mui/material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { PageTitle, DynamicTable, DynamicTableCell, UploadButton } from "../../components";
import { PROTECTED_ROUTES } from "../../config/routeConfig";
import { useUploadRecords } from "./useUploadRecords";
import { useSnackbarContext } from "../../contexts/SnackbarContext";
import { useFetchPendingRecords } from "./useFetchPendingRecords";
import { AcquisitionRecord } from "../../types";
import { Menu } from "lucide-react";
import { SearchParams } from "../../types/Catalog/SearchParams";

const AccessionRecord: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    const navigate = useNavigate();
    const { uploadRecords } = useUploadRecords();
    const showSnackbar = useSnackbarContext();
    const { isLoading: isFetching, data: pendingRecords = [], error, refetch } = useFetchPendingRecords();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Accession Record - Library Management System");
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

    const handleUploadSuccess = (parsedData: any) => {
        uploadRecords(parsedData, {
            onSuccess: () => {
                showSnackbar("CSV Parsed Successfully!", "success");
                refetch();
            },
            onError: (error) => showSnackbar(`${error}`, "error"),
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const handleAction = (value: string, record: AcquisitionRecord) => {
        console.log(`Action selected: ${value} for`, record);

        if (value === "fastCatalog") {
            navigate(PROTECTED_ROUTES.CATALOG.replace(":isbn", record.isbn), {
                state: { acquisitionData: record }
            });
        } else if (value === "copyCatalog") {
            const advancedSearchParams: SearchParams = {
                criteria: [
                    { idx: "q", searchTerm: record.book_title, operator: "AND" },
                    { idx: "intitle", searchTerm: record.book_title, operator: "AND" },
                    { idx: "isbn", searchTerm: record.isbn, operator: "AND" },
                    { idx: "inpublisher", searchTerm: record.publisher, operator: "AND" },
                ],
                library: "All libraries",
            };
            navigate(PROTECTED_ROUTES.BROWSEALLBOOKS, {
                state: {
                    searchParams: advancedSearchParams,
                    searchResults: [],
                    library: "All libraries",
                    modalParams: {
                        criteria: advancedSearchParams.criteria
                    },
                    acquisitionData: record
                }
            });
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const columns = [
        { key: "book_title", label: "Book Title" },
        { key: "isbn", label: "ISBN" },
        { key: "purchase_price", label: "Purchase Price", render: (row: any) => row.purchase_price.toFixed(2) },
        { key: "purchase_date", label: "Purchase Date" },
        { key: "acquired_date", label: "Acquired Date" },
        { key: "vendor", label: "Vendor" },
        { key: "vendor_location", label: "Vendor Location" },
        { key: "funding_source", label: "Funding Source" },
        {
            key: "action",
            label: "",
            render: (row: AcquisitionRecord) => (
                <DynamicTableCell
                    type="menu"
                    options={[
                        { value: "copyCatalog", label: "Copy Catalog" },
                        { value: "fastCatalog", label: "Fast Catalog" },
                    ]}
                    onAction={(value) => handleAction(value, row)}
                />
            )
        }
    ];

    /////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <PageTitle title="Accession Record" />

            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box width="100%">
                    <UploadButton
                        fileType="acquisition"
                        onSuccess={handleUploadSuccess}
                        onError={(error) => showSnackbar(error, "error")}
                        label="Upload CSV"
                    />
                </Box>

                {/* Table to display pending records */}
                <Box mt={1}>
                    <DynamicTable
                        columns={columns}
                        data={pendingRecords}
                        loading={isFetching}
                        error={error}
                    />
                </Box>
            </Container>
        </>
    );
};

export default AccessionRecord;
