import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, UploadButton, Dropdown, Loading } from "../../../../components";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { useFetchAllDepartments } from "../Department/useFetchAllDepartments";
import { useFetchAllProgramsByDepartment } from "./useFetchAllProgramsByDepartment";
import { useUploadPrograms } from "./useUploadPrograms";
import NoDataPage from "../../NoDataPage";
import { Menu } from "lucide-react";

const UploadPrograms: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { isLoading: isFetchingDepartment, data: departments } = useFetchAllDepartments();

    const [selectedDepartment, setSelectedDepartment] = useState("");

    const { isLoading: isFetchingProgram, data: programs = [], error, refetch } =
        useFetchAllProgramsByDepartment(selectedDepartment);
    const showSnackbar = useSnackbarContext();
    const { uploadPrograms } = useUploadPrograms()

    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Upload Programs - Library Management System");
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

    if (isFetchingDepartment) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Loading />
            </Box>
        );
    }

    if (!departments || departments.length === 0) {
        return <NoDataPage missingEntity="Department" dependentEntity="Programs" />;
    }

    /////////////////////////////////////////////////////////////////////////////////////

    const handleUploadProgram = (parsedData: any) => {
        uploadPrograms(parsedData, {
            onSuccess: () => {
                showSnackbar("CSV Parsed Successfully!", "success");
                refetch()
            },
            onError: (error) => showSnackbar(`${error}`, "error"),
        })
    }

    /////////////////////////////////////////////////////////////////////////////////////
    const columns = [
        { key: "code", label: "CODE" },
        { key: "description", label: "DESCRIPTION" },
    ];
    return (
        <>
            <PageTitle title="Upload Program" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "1fr auto" }}
                    alignItems="center"
                    gap={2}
                >
                    <UploadButton
                        fileType="program"
                        onSuccess={handleUploadProgram}
                        onError={(error) => showSnackbar(error, "error")}
                        label="Upload Program"
                    />


                    <Dropdown
                        label="Select Department"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        options={departments?.map((dept) => ({ id: dept.dept_id, name: dept.dept_name }))}
                    />
                </Box>




                <Box mt={4}>
                    <DynamicTable
                        columns={columns}
                        data={programs}
                        loading={isFetchingProgram}
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

export default UploadPrograms