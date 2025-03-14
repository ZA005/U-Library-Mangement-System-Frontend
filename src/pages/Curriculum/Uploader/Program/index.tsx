import React, { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { IconButton, Container, Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, UploadButton, Loading } from "../../../../components";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { useFetchAllDepartments } from "../Department/useFetchAllDepartments";
import NoDataPage from "../../NoDataPage";
import MenuIcon from "@mui/icons-material/Menu";

const UploadPrograms: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { isLoading, data: departments } = useFetchAllDepartments();

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

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Loading />
            </Box>
        );
    }

    if (!departments || departments.length === 0) {
        return <NoDataPage missingEntity="Department" dependentEntity="Programs" />;
    }



    return (
        <>
            <PageTitle title="Upload Program" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>

            </Container>
        </>
    )
}

export default UploadPrograms