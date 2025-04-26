import React, { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { IconButton, Container, Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { Menu } from "lucide-react";
import LeftContent from "./leftContent";
import RightContent from "./RightContent";
import { PageTitle } from "../../../components";

const BrowseCurriculum: React.FC = () => {

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Browse Curriculum - Library Management System");
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
    return (
        <>
            <PageTitle title="Courses and Programs" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box display="flex" justifyContent="space-between">
                    <Box flex={1}>
                        <LeftContent />
                    </Box>

                    <Box flex={1}>
                        <RightContent />
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default BrowseCurriculum