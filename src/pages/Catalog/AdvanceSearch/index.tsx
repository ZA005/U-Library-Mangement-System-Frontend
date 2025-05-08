import { useEffect, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { IconButton, Container, Stack, Typography, Divider, Tabs, Tab, Box, Button } from "@mui/material";
import { Menu } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { PageTitle } from "../../../components";
import CriteriaSection from "./CriteriaSection";
import TabCheckboxGroup from "./TabCheckboxGroup";
import LimitsSection from "./LimitsSection";
import LocationAvailabilitySection from "./LocationAvailabilitySection";
import SortingSection from "./SortingSection";
import { useFetchAdvanceSearch } from "./useFetchAdvanceSearch";
import { AdvanceSearchParams } from "../../../types/Catalog/AdvanceSearchParams";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";
const AdvanceSearchPage: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Advance Search - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen(prev => !prev)}>
                <Menu color="#d32f2f" />
            </IconButton>
        );

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);
    /////////////////////////////////////////////////////////////////////////////////////
    const [searchParams, setSearchParams] = useState<AdvanceSearchParams>({
        criteria: [{ idx: "q", searchTerm: "", operator: 'AND' }],
        yearRange: "",
        language: "No limit",
        isAvailableOnly: false,
        library: "All libraries",
        sortOrder: "Acquisition date: newest to oldest",
        sections: [],
        collection: [],
    });
    const [activeTab, setActiveTab] = useState(0);
    const [yearRangeError, setYearRangeError] = useState(false);
    const navigate = useNavigate();
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => { setActiveTab(newValue); };

    const resetSearch = () => {
        setSearchParams({
            criteria: [{ idx: "q", searchTerm: "", operator: 'AND' }],
            yearRange: "",
            language: "No limit",
            isAvailableOnly: false,
            library: "All libraries",
            sortOrder: "Acquisition date: newest to oldest",
            sections: [],
            collection: [],
        });
    };
    const requestBody = {
        criteria: searchParams.criteria.filter(
            (criterion) => criterion.searchTerm.trim() !== ""
        ),
        yearRange: searchParams.yearRange,
        language: searchParams.language !== "No limit" ? searchParams.language : null,
        isAvailableOnly: searchParams.isAvailableOnly,
        library:
            searchParams.library !== "All libraries"
                ? searchParams.library
                : "All libraries",
        sortOrder: searchParams.sortOrder,
        sections: searchParams.sections.length > 0 ? searchParams.sections : [],
        collection: searchParams.collection.length > 0 ? searchParams.collection : [],
    };

    const {
        refetch: refetchSearch,
    } = useFetchAdvanceSearch(requestBody);


    const handleSearch = async () => {
        try {
            const result = await refetchSearch();
            const updatedResults = result.data || [];
            navigate(PROTECTED_ROUTES.BROWSEALLBOOKS, {
                state: {
                    searchResults: updatedResults,
                    searchParams,
                    library: searchParams.library
                },
            });
        } catch (error) {
            console.error("Search failed:", error);
            navigate(PROTECTED_ROUTES.BROWSEALLBOOKS, {
                state: {
                    searchResults: [],
                    query: "Search failed",
                    source: searchParams.library || "All libraries",
                },
            });
        }
    }

    return (
        <>
            <PageTitle title="Advance Search" />
            <Container maxWidth="lg" sx={{ padding: "0 !important", marginBottom: 2 }}>
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Search Criteria
                    </Typography>
                    <CriteriaSection
                        criteria={searchParams.criteria}
                        setCriteria={(newCriteria => setSearchParams((prev) => (
                            { ...prev, criteria: newCriteria }
                        )))}
                    />

                    <Divider />

                    <Typography variant="h6" fontWeight="bold">
                        Filters
                    </Typography>

                    <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary"
                        textColor="primary" >
                        {["Sections", "Collection Type"].map((label, index) => (
                            <Tab label={label} key={index} />
                        ))}
                    </Tabs>
                    <TabCheckboxGroup
                        activeTab={activeTab}
                        sections={searchParams.sections}
                        collection={searchParams.collection}
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
                        setYearRangeError={setYearRangeError}
                    />

                    <Divider />

                    <Typography variant="h6" fontWeight="bold">
                        Location & Availability
                    </Typography>
                    <LocationAvailabilitySection
                        isAvailableOnly={searchParams.isAvailableOnly}
                        library={searchParams.library}
                        setIsAvailableOnly={(value) =>
                            setSearchParams((prev) => ({ ...prev, isAvailableOnly: value }))}
                        setLibrary={(value) =>
                            setSearchParams((prev) => ({ ...prev, library: value }))}
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

                    <Divider />

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
            </Container>
        </>
    );
}

export default AdvanceSearchPage;