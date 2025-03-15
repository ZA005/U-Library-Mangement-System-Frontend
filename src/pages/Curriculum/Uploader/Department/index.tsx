import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, UploadButton } from "../../../../components";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { useUploadDepartments } from "./useUploadDepartments";
import { useFetchAllDepartments } from "./useFetchAllDepartments";
import { Menu } from "lucide-react";

const UploadDepartments: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Upload Departments - Library Management System");
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

    const { uploadDepartments } = useUploadDepartments()
    const showSnackbar = useSnackbarContext();
    const { isLoading, data: departments = [], error, refetch } = useFetchAllDepartments()

    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    /////////////////////////////////////////////////////////////////////////////////////

    const handleUploadDepartment = (parsedData: any) => {
        uploadDepartments(parsedData, {
            onSuccess: () => {
                showSnackbar("CSV Parsed Successfully!", "success");
                refetch()
            },
            onError: (error) => showSnackbar(`${error}`, "error"),
        })
    }

    /////////////////////////////////////////////////////////////////////////////////////

    const columns = [
        { key: "dept_id", label: "ID" },
        { key: "dept_name", label: "NAME" },
        { key: "dept_code", label: "CODE" },
    ];


    console.log("Fetched departments:", departments);
    return (
        <>
            <PageTitle title="Upload Department" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "1fr auto" }}
                    alignItems="center"
                    gap={2}
                >
                    <UploadButton
                        fileType="department"
                        onSuccess={handleUploadDepartment}
                        onError={(error) => showSnackbar(error, "error")}
                        label="Upload Department"
                    />
                </Box>

                <Box mt={4}>
                    <DynamicTable
                        columns={columns}
                        data={departments}
                        loading={isLoading}
                        error={error}
                        page={page}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(_, value) => setPage(value)}
                    />
                </Box>
            </Container>
        </>
    )
}

export default UploadDepartments