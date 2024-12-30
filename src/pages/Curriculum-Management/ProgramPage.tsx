import React, { useState } from "react";
import { Box, Typography, Container, IconButton, Button, Divider, TextField, List, ListItem } from "@mui/material";
import Header from "../../components/Header/Header";
import Copyright from "../../components/Footer/Copyright";
import Line from "../../components/Line/Line";
import { useParams } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../../components/Sidebar";

const ProgramPage: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { departmentName, programName } = useParams();
    const [selectedBooks, setSelectedBooks] = useState<string[] | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const programCurriculum = {
        "Associate Of Computer Technology": {
            years: ["First Year", "Second Year"],
            subjectsByYear: {
                "First Year": ["Introduction to Computing", "Basic Mathematics", "Computer Hardware Fundamentals"],
                "Second Year": ["Operating Systems", "Web Development", "Database Management Systems"],
            },
        },
        "Bachelor Of Science In Information Technology": {
            years: ["First Year", "Second Year", "Third Year", "Fourth Year"],
            subjectsByYear: {
                "First Year": ["Introduction to Programming", "Basic Mathematics"],
                "Second Year": ["Data Structures", "Advanced Algebra"],
                "Third Year": ["Software Engineering", "Discrete Mathematics"],
                "Fourth Year": ["Capstone Project", "Artificial Intelligence"],
            },
        },
        // Add other programs similarly...
    };

    const capitalizeWords = (slug: string) => {
        return slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const handleViewBooks = (subject: string) => {
        console.log(`Viewing books for ${subject}`);
        // Mock data for books related to the subject
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

    const programData = programCurriculum[capitalizeWords(programName)];

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
                    {capitalizeWords(programName)}
                </Typography>
                <Line />
                <Box display="flex" justifyContent="space-between">
                    <Box width="100%" padding="0 1% 0 1%">
                        {programData ? (
                            <Box>
                                {programData.years.map((year) => (
                                    <Box key={year} mb={2}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {year}
                                        </Typography>
                                        <Box pl={2}>
                                            {programData.subjectsByYear[year]?.map((subject, index) => (
                                                <Box
                                                    key={index}
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    mb={1}
                                                >
                                                    <Typography variant="body2">{subject}</Typography>
                                                    <Button
                                                        onClick={() => handleViewBooks(subject)}
                                                        sx={{ color: "#EA4040", textTransform: "none" }}
                                                    >
                                                        View Books
                                                    </Button>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Divider />
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                Curriculum data is not available for this program.
                            </Typography>
                        )}
                    </Box>
                    {/* border="1px solid red" */}
                    <Box width="100%" >
                        {/* border="1px solid blue" */}
                        <Box height="100vh" padding="1rem" >
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
