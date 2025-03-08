import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box, Button, CircularProgress } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { PageTitle, DynamicTable, DynamicTableCell } from "../../components";
import { useCSVParser } from "../../hooks/CSVParse/useCSVParser";
import { useUploadRecords } from "./useUploadRecords";
import { useSnackbarContext } from "../../contexts/SnackbarContext";
import { useFetchPendingRecords } from "./useFetchPendingRecords";
import { AcquisitionRecord } from "../../types";

const AccessionRecord: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    const { isLoading: isParsing, validateAndParseCSV } = useCSVParser();
    const { uploadRecords } = useUploadRecords();
    const showSnackbar = useSnackbarContext();
    const { isLoading: isFetching, data: pendingRecords = [], error, refetch } = useFetchPendingRecords();

    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Accession Record - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)}>
                <MenuIcon />
            </IconButton>
        );
        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    /////////////////////////////////////////////////////////////////////////////////////

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            validateAndParseCSV(file, "acquisition", (parsedData) => {
                console.log("Parsed CSV Data:", parsedData);


                uploadRecords(parsedData, {
                    onSuccess: () => {
                        showSnackbar("CSV Parsed Successfully!", "success");
                        refetch();
                    },
                    onError: (error) => showSnackbar(`${error}`, "error")
                })
            });
            (event.target as HTMLInputElement).value = '';
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const handleAction = (value: string, record: AcquisitionRecord) => {
        console.log(`Action selected: ${value} for`, record);
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
            label: "Action",
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
                    <input
                        type="file"
                        accept=".csv"
                        id="csv-upload"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    <label htmlFor="csv-upload">
                        <Button variant="outlined" component="span" disabled={isParsing}>
                            {isParsing ? <CircularProgress size={24} /> : "Choose CSV File"}
                        </Button>
                    </label>

                </Box>

                {/* Table to display pending records */}
                <Box mt={4}>
                    <DynamicTable
                        columns={columns}
                        data={pendingRecords}
                        loading={isFetching}
                        error={error}
                        page={page}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(_, value) => setPage(value)}
                    />
                </Box>
            </Container>
        </>
    );
};

export default AccessionRecord;
