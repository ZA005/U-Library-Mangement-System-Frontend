import React, { useState } from "react";
import { CustomDialog, Dropdown, Loading } from "../../../../../components";
import { useSnackbarContext } from "../../../../../contexts/SnackbarContext";
import { List, ListItem, ListItemText, Box, TextField, Typography, Button, InputAdornment, Checkbox, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useFetchAllDepartments } from "../../../Uploader/Department/useFetchAllDepartments";
import { useFetchAllProgramsByDepartment } from "../../../Uploader/Program/useFetchAllProgramsByDepartment";
import { useFetchRevisionsByProgram } from "../../../Uploader/Curriculum/useFetchRevisionsByProgram";
import { useFetchAllCourseByRevision } from "../../../Uploader/Course/useFetchAllCourseByRevision";
import { Course, BookReference, Program } from "../../../../../types";

interface CopyBookReferenceProps {
    course: Course;
    onClose: () => void;
}

const CopyBookReference: React.FC<CopyBookReferenceProps> = ({ course, onClose }) => {
    const showSnackbar = useSnackbarContext();

    const { data: departments } = useFetchAllDepartments();
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [selectedRevision, setSelectedRevision] = useState<number | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    /////////////////////

    const { data: programs } = useFetchAllProgramsByDepartment(selectedDepartment);
    const { data: revisions = [], isLoading: isFetchingRevisions } = useFetchRevisionsByProgram(selectedProgram?.program_id ?? 0);
    const { isLoading: isFetchingCourse, data: courses = [], error, refetch } = useFetchAllCourseByRevision(selectedRevision ?? 0);

    /////////////////////
    const content = (
        <>
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }}
                alignItems="center"
                gap={1}
            >
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
            {error ? (
                <Box display="flex" justifyContent="center">
                    <Loading />
                </Box>
            ) : error ? (
                <Typography>Error fetching book references</Typography>
            ) : courses?.length > 0 ? (
                <List>
                    {courses.map((course, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={course.course_name}
                                secondary={`${course.program_description}`}
                            />
                            <Box display="flex" alignItems="center" gap={1}>
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                                    onClick={() => { }}
                                >
                                    Select
                                </Button>

                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                                    onClick={() => { }}
                                >
                                    View
                                </Button>


                            </Box>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No book references found</Typography>
            )}

        </>
    )
    return (
        <>
            <CustomDialog
                open={true}
                title={`Select a Course to Copy Its Book Reference for ${course.course_name}`}
                onClose={onClose}
                content={content}
            />
        </>
    )
}

export default CopyBookReference