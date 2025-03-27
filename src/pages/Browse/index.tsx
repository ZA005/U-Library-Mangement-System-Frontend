import { useEffect, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Box } from "@mui/material";
import { Menu } from "lucide-react";
import { NewlyAcquiredBookSection, BrowseBookSection, AccountOverviewSection } from "../../components";
import CustomSearchBar from "../../components/CustomSearchBar";
import { Books } from "../../types";

const Browse: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const [, setBooks] = useState<Books[]>([]);


    useEffect(() => {
        setTitle("Books - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)}>
                <Menu color="#d32f2f" />
            </IconButton>
        );

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    const handleSearchResults = (newBooks: Books[]) => {
        setBooks(newBooks);
    };

    return (
        <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
            <CustomSearchBar onSearch={handleSearchResults} />
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2} marginBottom="30px">
                <Box flex={3} display="flex" flexDirection="column" gap={2}>
                    <NewlyAcquiredBookSection />
                    <BrowseBookSection /> {/* No books prop passed */}
                </Box>
                <Box flex={1} display="flex" flexDirection="column" gap={2}>
                    <AccountOverviewSection />
                </Box>
            </Box>
        </Container>
    );
};

export default Browse;