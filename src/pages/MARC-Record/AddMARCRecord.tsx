import React, { useEffect, useState, useRef } from "react";
import { Box, Container, Typography, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Copyright from "../../components/Footer/Copyright";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import Sidebar from "../../components/Sidebar";
import { useLocation } from "react-router-dom";
import MARCSection from "./MARCSection";
import { marcSections } from "./MARCData";

interface BookData {
    book_title?: string;
    isbn?: string;
    publisher?: string;
    edition?: string;
    series?: string;
    price?: string;
    purchase_date?: string;
    acquired_date?: string;
    vendor_name?: string;
    vendor_location?: string;
    funding_source?: string;
    purchase_price?: string;
}

const AddMARCRecord: React.FC = () => {
    const location = useLocation();
    const [bookData, setBookData] = useState<BookData>({});
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (location.state && location.state.bookData) {
            // console.log("Book Data:", location.state.bookData);
            setBookData(location.state.bookData);

            setInputValues(prevValues => {
                const newValues = {
                    ...prevValues,
                    '020-a': location.state.bookData.isbn || '',
                    '245-a': location.state.bookData.book_title || '',
                    '250-a': location.state.bookData.edition || '',
                    '260-a': location.state.bookData.publisher || '',
                    '440-a': location.state.bookData.series || '',
                    '536-a': location.state.bookData.funding_source || '',
                    // '991-a': location.state.bookData.purchase_price || '',
                    // '991-b': location.state.bookData.vendor_name || '',
                    // '991-c': location.state.bookData.vendor_location || '',
                    // '992-a': location.state.bookData.purchase_date || '',
                    // '992-b': location.state.bookData.acquired_date || '',
                };
                // console.log("New Input Values:", newValues);
                return newValues;
            });
        }
    }, [location.state]);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    const handleInputChange = (marcNumber: string, subfieldCode: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [`${marcNumber}-${subfieldCode}`]: e.target.value,
        }));
    };

    const scrollToSection = (sectionIndex: number) => {
        const section = sectionRefs.current[sectionIndex];
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSave = () => {
        const marcFields = marcSections.flatMap(section => section.marcFields);
        const logData = Object.entries(inputValues).map(([key, value]) => {
            const [marcNumber, subfieldCode] = key.split('-');
            const marcField = marcFields.find(field => field.marcNumber === marcNumber);
            return {
                marcName: marcField ? marcField.marcName : 'Unknown Field',
                marcNumber,
                subfieldCode,
                value
            };
        });
        console.log('DATA', logData);
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />

            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1001,
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Header
                        buttons={
                            <IconButton onClick={handleSideBarClick}>
                                <MenuIcon style={{ color: "#EA4040" }} />
                            </IconButton>
                        }
                    />

                    <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" }, fontWeight: "bold" }}>
                        Add MARC-Record
                    </Typography>
                    <Line />
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2} overflow="auto" sx={{
                        backgroundColor: "white",
                        alignItems: "center"
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{
                                backgroundColor: "#EA4040",
                                color: "white",
                                '&:hover': {
                                    backgroundColor: "#D32F2F",
                                },
                                textTransform: 'uppercase',
                                maxWidth: "5rem",
                                marginRight: "10px"
                            }}
                        >
                            Save
                        </Button>
                        <Box display="flex" justifyContent="flex-end" flexWrap="nowrap" gap={1}>
                            {marcSections.map((section, index) => (
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
                                        minWidth: "5rem",
                                        flexShrink: 1,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {index}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                </Box>


                {marcSections.map((section, index) => (
                    <MARCSection
                        key={index}
                        section={section}
                        inputValues={inputValues}
                        onInputChange={handleInputChange}
                        ref={(el) => (sectionRefs.current[index] = el)}
                    />
                ))}
            </Container>

            <Copyright />
        </Box>
    );
};

export default AddMARCRecord;