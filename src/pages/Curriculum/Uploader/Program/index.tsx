import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, UploadButton, Loading } from "../../../../components";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { useFetchAllDepartments } from "../Department/useFetchAllDepartments";
import { useFetchAllProgramsByDepartment } from "./useFetchAllProgramsByDepartment";
import { useUploadPrograms } from "./useUploadPrograms";
import NoDataPage from "../../NoDataPage";
import MenuIcon from "@mui/icons-material/Menu";

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
                <MenuIcon sx={{ color: "#d32f2f" }} />
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
                <Box display="flex">
                    <Box width="100%">
                        <UploadButton
                            fileType="program"
                            onSuccess={handleUploadProgram}
                            onError={(error) => showSnackbar(error, "error")}
                            label="Upload Program"
                        />
                    </Box>

                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="department-label">Select Department</InputLabel>
                        <Select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            displayEmpty
                            label="Select Department"
                        >
                            {departments?.map((dept) => (
                                <MenuItem key={dept.dept_id} value={dept.dept_id}>
                                    {dept.dept_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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