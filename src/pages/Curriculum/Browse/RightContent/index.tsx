import React, { useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "../../../../config/routeConfig";
import { useFetchAllDepartments } from "../../Uploader/Department/useFetchAllDepartments";
import { useFetchAllProgramsByDepartment } from "../../Uploader/Program/useFetchAllProgramsByDepartment";
import { Program } from "../../../../types";

const RightContent: React.FC = () => {
    const navigate = useNavigate();

    const { data: departments = [], isLoading: departmentsLoading, error: departmentsError } = useFetchAllDepartments();

    const [selectedDepartment, setSelectedDepartment] = useState<string>("");

    const { isLoading: programsLoading, data: programs = [], error: programsError } =
        useFetchAllProgramsByDepartment(selectedDepartment);

    const handleToggle = (deptId: string) => {
        if (selectedDepartment === deptId) {
            // Deselect if same department clicked
            setSelectedDepartment("");
        } else {
            setSelectedDepartment(deptId);
        }
    };

    const handleViewSubjects = (program: Program) => {
        console.log(`Program: ${program.description.toLowerCase().replace(/\s/g, "-")} | Program ID: ${program.program_id}`);
        navigate(PROTECTED_ROUTES.CURRICULUM_PROGRAM.replace(":program", program.description.toLowerCase().replace(/\s/g, "-")), {
            state: {
                program
            }
        })
    };

    return (
        <>
            {departmentsLoading ? (
                <Typography variant="body2">Loading departments...</Typography>
            ) : departmentsError ? (
                <Typography variant="body2" color="error">Error loading departments</Typography>
            ) : (
                departments.map((department) => {
                    const isExpanded = selectedDepartment === department.dept_id;

                    return (
                        <Box key={department.dept_id} mb={2} width="100%">
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                borderBottom="1px solid #ccc"
                                pb={1}
                                mb={1}
                            >
                                <Typography variant="body1" fontWeight="bold">
                                    {department.dept_name}
                                </Typography>
                                <Button
                                    onClick={() => handleToggle(department.dept_id)}
                                    sx={{ color: "#EA4040", textTransform: "none" }}
                                >
                                    {isExpanded ? "Minimize" : "View Programs"}
                                </Button>
                            </Box>

                            {isExpanded && (
                                <Box pl={2}>
                                    {programsLoading ? (
                                        <Typography variant="body2">Loading programs...</Typography>
                                    ) : programsError ? (
                                        <Typography variant="body2" color="error">Error loading programs</Typography>
                                    ) : programs.length > 0 ? (
                                        programs.map((program) => (
                                            <Box
                                                key={program.program_id}
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                mb={1}
                                            >
                                                <Typography variant="body2">
                                                    {program.description}
                                                </Typography>
                                                <Button
                                                    sx={{ color: "#EA4040", textTransform: "none" }}
                                                    onClick={() => handleViewSubjects(program)}
                                                >
                                                    View Subjects
                                                </Button>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            No programs available.
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Box>
                    );
                })
            )}
        </>
    );
};

export default RightContent;
