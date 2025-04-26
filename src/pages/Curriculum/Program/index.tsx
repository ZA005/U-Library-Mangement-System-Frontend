import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { Container, IconButton, Box } from "@mui/material";
import { PageTitle } from "../../../components";
import { useFetchAllCourseByProgram } from "../Uploader/Course/useFetchAllCoursesByProgram";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";
import { Menu } from "lucide-react";
import { Program } from "../../../types";

const CurriculumProgram: React.FC = () => {

    const location = useLocation()
    const { program }: { program: Program } = location.state || {};
    const { data = [] } = useFetchAllCourseByProgram(program.program_id)
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle(`${program.description} - Library Management System`);
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)}>
                <Menu color="#d32f2f" />
            </IconButton>
        );
        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen, program]);

    /////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <PageTitle title={program.description} />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box display="flex" justifyContent="space-between">
                    <Box flex={1}>
                        <LeftContent courses={data} onSelectCourse={setSelectedCourseId} />
                    </Box>

                    <Box flex={1} height="65vh" width="60vw" paddingLeft="1rem" overflow="auto">
                        <RightContent selectedCourseId={selectedCourseId} />
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default CurriculumProgram