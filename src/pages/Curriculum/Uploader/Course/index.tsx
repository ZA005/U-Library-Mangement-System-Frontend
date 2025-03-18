import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { PageTitle, DynamicTable, UploadButton, Dropdown, Loading } from "../../../../components";
import { useFetchAllCurriculum } from "../Curriculum/useFetchAllCurriculum";
import { useFetchAllDepartments } from "../Department/useFetchAllDepartments";
import { useFetchAllProgramsByDepartment } from "../Program/useFetchAllProgramsByDepartment";
import { useFetchAllCourseByRevision } from "./useFetchAllCourseByRevision";
import { useSnackbarContext } from "../../../../contexts/SnackbarContext";
import { useFetchRevisionsByProgram } from "../Curriculum/useFetchRevisionsByProgram";
import NoDataPage from "../../NoDataPage";
import { Program } from "../../../../types";
import { Menu } from "lucide-react";
import { useUploadCourse } from "./useUploadCourse";
const UploadDepartments: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { isLoading: isFetchingAllCurriculum, data: allCurriculum } = useFetchAllCurriculum()
    const { data: departments } = useFetchAllDepartments();
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [selectedRevision, setSelectedRevision] = useState<number | null>(null);

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Upload Course - Library Management System");
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
    const { data: revisions = [], isLoading: isFetchingRevisions } = useFetchRevisionsByProgram(selectedProgram?.program_id ?? 0);
    const { isLoading: isFetchingCourse, data: courses = [], error, refetch } = useFetchAllCourseByRevision(selectedRevision ?? 0);
    const { uploadCourses } = useUploadCourse()

    const showSnackbar = useSnackbarContext();
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setSelectedProgram(null);
    }, [selectedDepartment]);

    /////////////////////////////////////////////////////////////////////////////////////

    if (isFetchingAllCurriculum) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Loading />
            </Box>
        )
    }

    if (!allCurriculum || allCurriculum.length === 0) {
        return <NoDataPage missingEntity="Curriculum" dependentEntity="Course" />;
    }

    /////////////////////////////////////////////////////////////////////////////////////

    const handleUploadCourse = (parsedData: any) => {
        uploadCourses(parsedData, {
            onSuccess: () => {
                showSnackbar("CSV Parsed Successfully!", "success");
                refetch()
            },
            onError: (error) => showSnackbar(`${error}`, "error"),
        })
    }

    /////////////////////////////////////////////////////////////////////////////////////
    const columns = [
        { key: "year_level", label: "Y/L" },
        { key: "sem", label: "SEM" },
        { key: "course_code", label: "CODE" },
        { key: "course_name", label: "NAME" },
    ]
    return (
        <>
            <PageTitle title="Upload Course" />
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr 1fr" }}
                    alignItems="center"
                    gap={1}
                >
                    <UploadButton
                        fileType="course"
                        onSuccess={handleUploadCourse}
                        onError={(error) => showSnackbar(error, "error")}
                        label="Upload Courses"
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
                            setSelectedRevision(null);
                        }}
                        options={programs?.map((prog) => ({ id: prog.program_id, name: prog.description })) || []}
                        disabled={!selectedDepartment}
                    />

                    <Dropdown
                        label="Select Revision"
                        value={selectedRevision ?? ""}
                        onChange={(e) => setSelectedRevision(Number(e.target.value))}
                        options={revisions.map((rev) => ({ id: rev, name: `Revision ${rev}` })) || []}
                        disabled={!selectedProgram || revisions.length === 0}
                    />
                </Box>

                <Box mt={4}>
                    <DynamicTable
                        columns={columns}
                        data={courses}
                        loading={isFetchingCourse}
                        error={error}
                        page={page}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(_, value) => setPage(value)}
                        customMsg="Please select Department, Program, and Revision to view Courses"
                        hasSelection={!!selectedDepartment && !!selectedProgram && !!selectedRevision}
                    />
                </Box>
            </Container>
        </>
    )
}

export default UploadDepartments