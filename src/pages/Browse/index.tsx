import { useEffect, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { FeaturedBookSection, NewlyAcquiredBookSection, BrowseBookSection, AccountOverviewSection } from "../../components";
import CustomSearchBar from "../../components/CustomSearchBar";
import { useFetchAllBooks } from "./useFetchAllBooks";
import { useFetchNewlyAcquired } from "./useFetchNewlyAcquired";
const Browse: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();



    useEffect(() => {
        setTitle("Books - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen(prev => !prev)}>
                <MenuIcon sx={{ color: "#d32f2f" }} />
            </IconButton>
        );

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    const [searchQuery, setSearchQuery] = useState("");
    const { isLoading: isFetching, data: allBooks, error, refetch } = useFetchAllBooks();
    const { data: newlyAcquired } = useFetchNewlyAcquired();

    return (
        <>
            {/* <PageTitle title="Browse Books" /> */}
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <CustomSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2} marginBottom="30px">
                    {/* Left Side: Main Content */}
                    <Box flex={3} display="flex" flexDirection="column" gap={2}>
                        {/* <FeaturedBookSection /> */}
                        <NewlyAcquiredBookSection books={newlyAcquired || []} />
                        <BrowseBookSection books={allBooks || []} />
                    </Box>

                    {/* Right Side: Sidebar */}
                    <Box flex={1} display="flex" flexDirection="column" gap={2}>
                        <AccountOverviewSection />
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Browse;
