import { useEffect, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Box } from "@mui/material";
import { Menu } from "lucide-react";
import CustomSearchBar from "../../components/CustomSearchBar";
import { useFetchNewlyAcquired } from "../../components/Sections/NewlyAcquiredBooks/useFetchNewlyAcquired";
import BookGrid from "../../components/Book/BookGrid";

const NewlyAcquiredBookPage: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    useEffect(() => {
        setTitle("Newly Acquired Books - Library Management System");
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

    const { data: allNewlyAcquired = [] } = useFetchNewlyAcquired()
    const [searchQuery, setSearchQuery] = useState("");
    return (
        <>
            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <CustomSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2} marginBottom="30px">
                    <BookGrid books={allNewlyAcquired} />
                </Box>
            </Container>
        </>
    )
}

export default NewlyAcquiredBookPage