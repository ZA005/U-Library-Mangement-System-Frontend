import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Container, IconButton, Button, Divider, TextField, List, ListItem } from "@mui/material";
import { Subject, getAllSubjectsByProgram } from "../../services/Curriculum/SubjectService";
import Header from "../../components/Header/Header";
import Copyright from "../../components/Footer/Copyright";
import Line from "../../components/Line/Line";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../../components/Sidebar";

const ProgramPage: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState<string[] | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const location = useLocation();
    const program = location.state?.program;

    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const fetchedSubjects = await getAllSubjectsByProgram(program?.id);
                setSubjects(fetchedSubjects);
            } catch (error) {
                console.error("Error fetching subjects", error);
            }
        }

        fetchSubject();
    }, [program?.id]);

    const handleViewBooks = (subject: string) => {
        console.log(`Viewing books for ${subject}`);
        const books = [
            `${subject} - Fundamentals`,
            `${subject} - Advanced Concepts`,
            `${subject} - Applications`,
        ];
        setSelectedBooks(books);
    };

    const filteredBooks = selectedBooks?.filter((book) =>
        book.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Sidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header
                    buttons={
                        <IconButton onClick={() => setSidebarOpen(!isSidebarOpen)}>
                            <MenuIcon style={{ color: "#EA4040" }} />
                        </IconButton>
                    }
                />
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                    fontWeight="bold"
                >
                    {program ? `${program.name}` : "No Program Data"}
                </Typography>
                <Line />
                <Box display="flex" justifyContent="space-between">
                    <Box width="100%" padding="0 1% 0 1%">
                        {subjects && subjects.length > 0 ? (
                            <Box>
                                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yearLabel, yearIndex) => {
                                    const yearSubjects = subjects.filter(subject => subject.year === yearIndex + 1);

                                    return (
                                        <Box key={yearLabel} mb={2}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {yearLabel}
                                            </Typography>
                                            <Box pl={2}>
                                                {yearSubjects.length > 0 ? (
                                                    yearSubjects.map((subject, index) => (
                                                        <Box
                                                            key={index}
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            alignItems="center"
                                                            mb={1}
                                                        >
                                                            <Typography variant="body2">{subject.subject_name}</Typography>
                                                            <Button
                                                                onClick={() => handleViewBooks(subject.subject_name)}
                                                                sx={{ color: "#EA4040", textTransform: "none" }}
                                                            >
                                                                View Books
                                                            </Button>
                                                        </Box>
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary">
                                                        No subjects available for {yearLabel}.
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Divider />
                                        </Box>
                                    );
                                })}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                Curriculum data is not available for this program.
                            </Typography>
                        )}
                    </Box>

                    <Box width="100%">
                        <Box height="100vh" padding="1rem">
                            <TextField
                                label="Search Books"
                                variant="outlined"
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ marginBottom: "1rem" }}
                            />
                            {selectedBooks ? (
                                <Box>
                                    <List>
                                        {filteredBooks?.map((book, index) => (
                                            <ListItem key={index}>{book}</ListItem>
                                        ))}
                                    </List>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    Select a subject to view the list of books.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Container>
            <Copyright />
        </Box>
    );
};

export default ProgramPage;
