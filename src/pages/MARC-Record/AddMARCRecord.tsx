import React, { useRef, useState } from "react";
import {
    Box,
    Container,
    Typography,
    IconButton,
    Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Copyright from "../../components/Footer/Copyright";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import MARCSection from "../../components/MARC/MARCSection";
import Sidebar from "../../components/Sidebar";
import { marcSections } from "./MARCSectionsData";

const AddMARCRecord: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    // Handle changes in MARC field inputs
    const handleInputChange = (marcNumber: string, subfieldCode: string, value: string) => {
        setInputValues((prevValues) => {
            // Create a new object by copying the previous values
            const updatedValues = { ...prevValues };

            // Set the specific field using a key generated from marcNumber and subfieldCode
            const key = `${marcNumber}-${subfieldCode}`;
            updatedValues[key] = value;

            // Return the updated object
            return updatedValues;
        });
    };


    // Scroll to a specific section by index
    const scrollToSection = (sectionIndex: number) => {
        const section = sectionRefs.current[sectionIndex];
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            {/* Sidebar Component */}
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                {/* Header Component */}
                <Header
                    buttons={
                        <IconButton onClick={handleSideBarClick}>
                            <MenuIcon style={{ color: "#EA4040" }} />
                        </IconButton>
                    }
                />

                {/* Title */}
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                    fontWeight="bold"
                >
                    Add MARC-Record
                </Typography>

                <Line />

                {/* Section Navigation Buttons */}
                <Box
                    display="flex"
                    justifyContent="space-around"
                    mt={2}
                    mb={2}
                    overflow="auto"
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        backgroundColor: "white",
                        padding: "0.5rem 0",
                    }}
                >
                    <Box display="flex" justifyContent="center" flexWrap="nowrap" gap={1}>
                        {marcSections.map((_, index) => (
                            <Button
                                key={index}
                                variant="outlined"
                                onClick={() => scrollToSection(index)}
                                sx={{
                                    color: "#EA4040",
                                    border: "2px solid #EA4040",
                                    "&:hover": {
                                        backgroundColor: "#EA4040",
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

                {/* MARC Sections */}
                {marcSections.map((section, index) => (
                    <div
                        key={index}
                        ref={(el) => (sectionRefs.current[index] = el)}
                        style={{ marginBottom: "2rem" }}
                    >
                        <MARCSection
                            sectionNumber={section.sectionNumber}
                            marcFields={section.marcFields}
                            inputValues={inputValues}
                            handleInputChange={handleInputChange}
                        />
                    </div>
                ))}
            </Container>

            {/* Footer Component */}
            <Copyright />
        </Box>
    );
};

export default AddMARCRecord;
