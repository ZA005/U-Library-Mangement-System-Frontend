import React, { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { IconButton, Container, Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, UploadButton } from "../../../../components";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { useUploadDepartments } from "./useUploadDepartments";
import { useFetchAllDepartments } from "./useFetchAllDepartments";
// import { Department } from "../../../../types";
import MenuIcon from "@mui/icons-material/Menu";

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
                <MenuIcon sx={{ color: "#d32f2f" }} />
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
        { key: "id", label: "ID" },
        { key: "name", label: "NAME" },
        { key: "code", label: "CODE" },
    ]
    return (
        <>
            <PageTitle title="Upload Department" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box width="100%">
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
                    // page={page}
                    // itemsPerPage={itemsPerPage}
                    // onPageChange={(_, value) => setPage(value)}
                    />
                </Box>
            </Container>
        </>
    )
}

export default UploadDepartments