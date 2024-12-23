import React, { useState } from "react";
import { Box, Container, Typography, IconButton, Button} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Copyright from "../../components/Footer/Copyright";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import MARCSection from "../../components/MARC/MARCSection";
import Sidebar from "../../components/Sidebar";
import { marcSections } from "./MARCSectionsData";

const AddMARCRecord: React.FC = () => {
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    const handleSectionClick = (section: number) => {
        console.log(`Section ${section} clicked!`);
        setActiveSection(section);
    };

    const handleInputChange = (marcNumber: string, subfieldCode: string, value: string) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [`${marcNumber}-${subfieldCode}-${activeSection}`]: value,
        }));
    };
    
    const activeSectionData = activeSection !== null ? marcSections[activeSection] : null;

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header
                    buttons={
                        <IconButton onClick={handleSideBarClick}>
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
                    Add MARC-Record
                </Typography>
                <Line />

                
                <Box display="flex" justifyContent="space-around" mt={2} mb={2} overflow="auto">
                    <Box display="flex" justifyContent="center" flexWrap="nowrap" gap={1}>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Button
                                key={index}
                                variant={activeSection === index ? "contained" : "outlined"}
                                onClick={() => handleSectionClick(index)}
                                sx={{
                                    backgroundColor: activeSection === index ? "#EA4040" : undefined,
                                    color: activeSection === index ? "#FFF" : "#EA4040",
                                    border: activeSection !== index ? "2px solid #EA4040" : undefined,
                                    "&:hover": {
                                        backgroundColor: activeSection === index ? "#c53030" : "#EA4040",
                                        color: "white",
                                    },
                                    minWidth: "5vw",
                                    flexShrink: 1,
                                    fontWeight: "bold",
                                }}
                            >
                                {index}
                            </Button>
                        ))}
                    </Box>
                </Box>

                {activeSectionData ? (
                    <MARCSection
                        sectionNumber={activeSectionData.sectionNumber}
                        marcFields={activeSectionData.marcFields}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                    />
                ) : activeSection === null ? (
                    <Typography variant="body1" color="textSecondary" textAlign="center">
                        Please select a valid section.
                    </Typography>
                ) : null}
            </Container>
            <Copyright />
        </Box>
    );
};

export default AddMARCRecord;
