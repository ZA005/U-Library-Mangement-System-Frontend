import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, UploadButton, Loading } from "../../../../components";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { useFetchAllDepartments } from "../Department/useFetchAllDepartments";
import { useFetchAllPrograms } from "../Program/useFetchAllPrograms";
import { useFetchAllProgramsByDepartment } from "../Program/useFetchAllProgramsByDepartment";
import NoDataPage from "../../NoDataPage";
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
        setTitle("Upload Curriculum - Library Management System");
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

    const { isLoading: isFetchingAllPrograms, data: allPrograms } = useFetchAllPrograms()
    const { isLoading: isFetchingDepartment, data: departments } = useFetchAllDepartments();

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const { isLoading: isFetchingProgram, data: programs } =
        useFetchAllProgramsByDepartment(selectedDepartment);

    const showSnackbar = useSnackbarContext();
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    /////////////////////////////////////////////////////////////////////////////////////

    if (isFetchingAllPrograms) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Loading />
            </Box>
        );
    }

    if (!allPrograms || allPrograms.length === 0) {
        return <NoDataPage missingEntity="Programs" dependentEntity="Curriculum" />;
    }

    /////////////////////////////////////////////////////////////////////////////////////



    /////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <PageTitle title="Upload Curriculum" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>

            </Container>
        </>
    )
}

export default UploadDepartments