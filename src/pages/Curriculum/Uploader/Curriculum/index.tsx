import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, UploadButton, Dropdown, Loading } from "../../../../components";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { useFetchAllDepartments } from "../Department/useFetchAllDepartments";
import { useFetchAllPrograms } from "../Program/useFetchAllPrograms";
import { useFetchAllProgramsByDepartment } from "../Program/useFetchAllProgramsByDepartment";
import { useFetchAllCurriculumByProgram } from "./useFetchAllCurriculumsByProgram";
import { useUploadCurriculums } from "./useUploadCurriculum";
import { convertYearRange } from "../../../../utils/convert";
import { Program } from "../../../../types";
import NoDataPage from "../../NoDataPage";
import { Menu } from "lucide-react";

const UploadDepartments: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { isLoading: isFetchingAllPrograms, data: allPrograms } = useFetchAllPrograms()
    const { data: departments } = useFetchAllDepartments();
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

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
                <Menu color="#d32f2f" />
            </IconButton>
        );
        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    /////////////////////////////////////////////////////////////////////////////////////

    const { data: programs } = useFetchAllProgramsByDepartment(selectedDepartment);
    const { isLoading: isFetchingCurriculum, data: curriculums = [], error, refetch } = useFetchAllCurriculumByProgram(selectedProgram?.program_id ?? 0);
    const { uploadCurriculums } = useUploadCurriculums()

    const showSnackbar = useSnackbarContext();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setSelectedProgram(null);
    }, [selectedDepartment]);

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

    const handleUploadCurriculum = (parsedData: any) => {
        uploadCurriculums(parsedData, {
            onSuccess: () => {
                showSnackbar("CSV Parsed Successfully!", "success");
                refetch()
            },
            onError: (error) => showSnackbar(`${error}`, "error"),
        })
    }

    /////////////////////////////////////////////////////////////////////////////////////
    const columns = [
        { key: "program_code", label: "CODE" },
        { key: "program_description", label: "NAME" },
        { key: "revision_no", label: "REVISION" },
        // { key: "effectivity_sem", label: "SEMESTER" },
        { key: "effectivity_sy", label: "YEAR", render: (row: any) => row.effectivity_sy ? convertYearRange(row.effectivity_sy) : `N/A` },
    ]

    return (
        <>
            <PageTitle title="Upload Curriculum" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }}
                    alignItems="center"
                    gap={2}
                >
                    <UploadButton
                        fileType="curriculum"
                        onSuccess={handleUploadCurriculum}
                        onError={(error) => showSnackbar(error, "error")}
                        label="Upload Curriculum"
                    />

                    <Dropdown
                        label="Select Department"
                        value={selectedDepartment ?? ""}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        options={departments?.map((dept) => ({ id: dept.dept_id, name: dept.dept_name }))}
                    />

                    <Dropdown
                        label="Select Program"
                        value={selectedProgram?.program_id ?? ""}
                        onChange={(e) => {
                            const program = programs?.find((prog) => prog.program_id === Number(e.target.value));
                            setSelectedProgram(program || null);
                        }}
                        options={programs?.map((prog) => ({ id: prog.program_id, name: prog.description })) || []}
                        disabled={!selectedDepartment}
                    />

                </Box>

                <Box mt={4}>
                    <DynamicTable
                        columns={columns}
                        data={curriculums}
                        loading={isFetchingCurriculum}
                        error={error}
                        customMsg="Please select Department and Program to view Curriculum"
                        hasSelection={!!selectedDepartment && !!selectedProgram}
                    />
                </Box>
            </Container>
        </>
    )
}

export default UploadDepartments