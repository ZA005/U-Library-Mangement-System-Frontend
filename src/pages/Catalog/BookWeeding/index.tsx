import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Dropdown, DynamicTable, DynamicTableCell, PageTitle } from "../../../components";
import { bookWeedingStatusOptions } from "../../../utils/BookWeedingStatusOptions";
import { WeedingInfo } from "../../../types/Catalog/WeedingInfo";
import { useFetchFlaggedBooks } from "./useFetchFlaggedBooks";

const WeedingPage: React.FC = () => {

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Book Weeding - Library Management System");
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
    const [filter, setFilter] = useState<{ criteria?: string, accessionNo?: string, status: string }>({
        status: 'FLAGGED'
    });
    const { isLoading, data: flaggedBooks = [], error, refetch } = useFetchFlaggedBooks();
    const handleFilterChange = (field: keyof typeof filter, value: string) => {
        setFilter(prev => ({ ...prev, [field]: value }));
    };
    const handleViewReferences = () => {

    }
    const columns = [
        { key: "accessionNumber", label: "Accession Number" },
        { key: "callNumber", label: "Call Number" },
        { key: "bookTitle", label: "Title" },
        { key: "authors", label: "Author" },
        { key: "weedingCriteriaDdc", label: "Weeding Criteria" },
        {
            key: "action",
            label: "",
            render: (row: WeedingInfo) => (
                <DynamicTableCell
                    type="button"
                    buttonText="View Book Reference"
                    onAction={() => { handleViewReferences(row) }}
                />
            ),
        }
    ]
    return (
        <>
            <PageTitle title="Manage Book Weeding" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        size="small"
                        label="Search Criteria"
                        variant="outlined"
                        fullWidth
                        value={filter.criteria || ''}
                        onChange={(e) => handleFilterChange('criteria', e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={15} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        size="small"
                        label="Search Accession Number"
                        variant="outlined"
                        fullWidth
                        value={filter.accessionNo || ''}
                        onChange={(e) => handleFilterChange('accessionNumber', e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={15} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Dropdown
                        label="Select Status"
                        value={filter.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value as string)}
                        options={bookWeedingStatusOptions.map((status) => ({ id: status.id, name: status.name }))}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
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
                    // onClick={() => navigate('/admin/catalog/management/criteria')}
                    >
                        View Criteria
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                    // onClick={}
                    >
                        Initiate Book Weeding Process
                    </Button>
                </Box>
            </Box>
            <Box mt={2}>
                <DynamicTable
                    columns={columns}
                    data={flaggedBooks}
                    loading={isLoading}
                    error={error ? error.message : undefined}
                    customSize="200px"
                />
            </Box>

        </>
    );
}

export default WeedingPage;