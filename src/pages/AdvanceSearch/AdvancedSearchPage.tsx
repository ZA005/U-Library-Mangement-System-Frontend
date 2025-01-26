import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    IconButton,
    Stack,
    Tabs,
    Tab,
    Typography,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import Sidebar from "../../components/Sidebar";
import { getBooksByAdvancedSearch } from "../../services/Cataloging/LocalBooksAPI";
import { useNavigate } from "react-router-dom";
import CriteriaSection from "./CriteriaSection";
import TabCheckboxGroup from "./TabCheckboxGroup";
import LimitsSection from "./LimitsSection";
import LocationAvailabilitySection from "./LocationAvailabilitySection";
import SortingSection from "./SortingSection";
import "./AdvancedSearch.css";

const AdvancedSearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Track the error state for the year range
    const [yearRangeError, setYearRangeError] = useState(false);

    // Define searchParams state with proper typing
    const [searchParams, setSearchParams] = useState({
        criteria: [{ idx: "q", searchTerm: "", operator: "AND" }],
        yearRange: "",
        language: "No limit",
        isAvailableOnly: false,
        individualLibrary: "All libraries",
        sortOrder: "Acquisition date: newest to oldest",
        itemType: [] as string[],
        sections: [] as string[],
        collection: [] as string[],
    });

    const handleSideBarClick = () => setSidebarOpen(!isSidebarOpen);
    const handleSidebarClose = () => setSidebarOpen(false);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSearch = async () => {
        const requestBody = {
            criteria: searchParams.criteria.filter(
                (criterion) => criterion.searchTerm.trim() !== ""
            ),
            yearRange: searchParams.yearRange,
            language: searchParams.language !== "No limit" ? searchParams.language : null,
            isAvailableOnly: searchParams.isAvailableOnly,
            individualLibrary:
                searchParams.individualLibrary !== "All libraries"
                    ? searchParams.individualLibrary
                    : null,
            sortOrder: searchParams.sortOrder,
            itemType: searchParams.itemType.length > 0 ? searchParams.itemType : null,
            sections: searchParams.sections.length > 0 ? searchParams.sections : null,
            collection: searchParams.collection.length > 0 ? searchParams.collection : null,
        };

        try {
            console.log("Request Body:", requestBody);
            const response = await getBooksByAdvancedSearch(requestBody);
            navigate("/admin/catalog/management/search-title", {
                state: {
                    query: requestBody,
                    books: response || [],
                    source: "All libraries",
                },
            });
        } catch (error) {
            console.error("Error fetching search results:", error);
            navigate("/admin/catalog/management/search-title", {
                state: { query: requestBody, books: [], source: "All libraries" },
            });
        }
    };

    const resetSearch = () => {
        setSearchParams({
            criteria: [{ idx: "", searchTerm: "", operator: "AND" }],
            yearRange: "",
            language: "No limit",
            isAvailableOnly: false,
            individualLibrary: "All libraries",
            sortOrder: "Acquisition date: newest to oldest",
            itemType: [],
            sections: [],
            collection: [],
        });
    };

    const addCriterion = () => {
        setSearchParams((prevState) => ({
            ...prevState,
            criteria: [
                ...prevState.criteria,
                { idx: "", searchTerm: "", operator: "AND" },
            ],
        }));
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" sx={{ flexGrow: 1, paddingBottom: 2 }}>
                <Header
                    buttons={
                        <IconButton onClick={handleSideBarClick}>
                            <MenuIcon style={{ color: "#ea4040" }} />
                        </IconButton>
                    }
                />
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Advanced Search
                </Typography>
                <Line />
                <Box
                    display="flex"
                    flexDirection="column"
                    marginTop={3}
                    padding={3}
                    borderRadius={2}
                    border="1px solid #ddd"
                    sx={{ backgroundColor: "#f9f9f9", flexGrow: 1, overflow: 'auto' }}
                >
                    <Stack spacing={2} sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Search Criteria
                        </Typography>
                        <CriteriaSection
                            criteria={searchParams.criteria}
                            setCriteria={(newCriteria) =>
                                setSearchParams((prev) => ({ ...prev, criteria: newCriteria }))
                            }
                        />
                        <Divider />

                        <Typography variant="h6" fontWeight="bold">
                            Filters
                        </Typography>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            sx={{ marginBottom: 3 }}
                        >
                            {["Item type", "Sections", "Collection Type"].map((label, index) => (
                                <Tab label={label} key={index} />
                            ))}
                        </Tabs>

                        <TabCheckboxGroup
                            activeTab={activeTab}
                            itemType={searchParams.itemType}
                            sections={searchParams.sections}
                            collection={searchParams.collection}
                            setItemType={(value) => {
                                setSearchParams((prev) => ({
                                    ...prev,
                                    itemType:
                                        typeof value === "function" ? value(prev.itemType) : value,
                                }));
                            }}
                            setSections={(value) => {
                                setSearchParams((prev) => ({
                                    ...prev,
                                    sections:
                                        typeof value === "function" ? value(prev.sections) : value,
                                }));
                            }}
                            setCollection={(value) => {
                                setSearchParams((prev) => ({
                                    ...prev,
                                    collection:
                                        typeof value === "function" ? value(prev.collection) : value,
                                }));
                            }}
                        />
                        <Divider />

                        <Typography variant="h6" fontWeight="bold">
                            Limits
                        </Typography>
                        <LimitsSection
                            yearRange={searchParams.yearRange}
                            language={searchParams.language}
                            setYearRange={(value) =>
                                setSearchParams((prev) => ({ ...prev, yearRange: value }))
                            }
                            setLanguage={(value) =>
                                setSearchParams((prev) => ({ ...prev, language: value }))
                            }
                            setYearRangeError={setYearRangeError} // Pass the error setter function
                        />
                        <Divider />
                        {/* Limits Section */}
                        <LimitsSection
                            yearRange={searchParams.yearRange}
                            language={searchParams.language}
                            setYearRange={(value) =>
                                setSearchParams((prev) => ({ ...prev, yearRange: value }))
                            }
                            setLanguage={(value) =>
                                setSearchParams((prev) => ({ ...prev, language: value }))
                            }
                            setYearRangeError={setYearRangeError} // Pass the error setter function
                        />

                        <Typography variant="h6" fontWeight="bold">
                            Location & Availability
                        </Typography>
                        <LocationAvailabilitySection
                            isAvailableOnly={searchParams.isAvailableOnly}
                            individualLibrary={searchParams.individualLibrary}
                            setIsAvailableOnly={(value) =>
                                setSearchParams((prev) => ({ ...prev, isAvailableOnly: value }))}
                            setIndividualLibrary={(value) =>
                                setSearchParams((prev) => ({ ...prev, individualLibrary: value }))}
                        />
                        <Divider />

                        <Typography variant="h6" fontWeight="bold">
                            Sorting Options
                        </Typography>
                        <SortingSection
                            sortOrder={searchParams.sortOrder}
                            setSortOrder={(value) =>
                                setSearchParams((prev) => ({ ...prev, sortOrder: value }))
                            }
                        />

                        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} marginTop={3}>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: "#ea4040", color: "white" }}
                                onClick={handleSearch}
                                disabled={yearRangeError}
                            >
                                Search
                            </Button>
                            <Button
                                variant="outlined"
                                style={{ borderColor: "#ea4040", color: "#ea4040" }}
                                onClick={resetSearch}
                            >
                                Reset
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default AdvancedSearchPage;
