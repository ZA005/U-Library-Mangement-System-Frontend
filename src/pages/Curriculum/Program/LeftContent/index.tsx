import React, { useState } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { Course } from "../../../../types";

interface LeftContentProps {
    courses: Course[];
    onSelectCourse: (courseId: number) => void;
}

const LeftContent: React.FC<LeftContentProps> = ({ courses, onSelectCourse }) => {
    const [expandedYear, setExpandedYear] = useState<number | null>(null);

    // Dummy handler for "View Books" — you can replace it with actual logic later
    const handleViewBooks = (courseId: number) => {
        console.log("View books for course ID:", courseId);
        onSelectCourse(courseId);
    };

    return (
        <>
            {courses && courses.length > 0 ? (
                <Box>
                    {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yearLabel, yearIndex) => {
                        const yearCourses = courses.filter((subject) => subject.year_level === yearIndex + 1);

                        return (
                            <Box key={yearLabel} mb={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" fontWeight="bold">
                                        {yearLabel}
                                    </Typography>
                                    {yearCourses.length > 0 ? (
                                        <Button
                                            variant="text"
                                            size="small"
                                            onClick={() => setExpandedYear(expandedYear === yearIndex + 1 ? null : yearIndex + 1)}
                                            sx={{ color: "#EA4040", textTransform: "none" }}
                                        >
                                            {expandedYear === yearIndex + 1 ? "Hide courses" : "View courses"}
                                        </Button>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            No courses available for this year level
                                        </Typography>
                                    )}
                                </Box>
                                {expandedYear === yearIndex + 1 && yearCourses.length > 0 && (
                                    <Box pl={2} mt={1}>
                                        {yearCourses.map((subject) => (
                                            <Box
                                                key={subject.course_id}
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                mb={1}
                                            >
                                                <Typography variant="body2">{subject.course_name}</Typography>
                                                <Button
                                                    onClick={() => handleViewBooks(subject.course_id)}
                                                    sx={{ color: "#EA4040", textTransform: "none" }}
                                                >
                                                    View Books
                                                </Button>
                                            </Box>
                                        ))}
                                        <Divider />
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    Curriculum data is not available for this program.
                </Typography>
            )}
        </>
    );
};

export default LeftContent;