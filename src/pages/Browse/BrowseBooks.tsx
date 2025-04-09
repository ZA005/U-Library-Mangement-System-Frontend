import { useEffect, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { IconButton, Container, Box, Typography } from "@mui/material";
import CustomSearchBar from "../../components/CustomSearchBar";
import { useFetchAllBooks } from "../../components/Sections/BrowseBooks/useFetchAllBooks";
import BookGrid from "../../components/Book/BookGrid";
import { Menu } from "lucide-react";
import { Books } from "../../types";
import { SearchParams } from "../../types/Catalog/SearchParams";
import { generateSearchMessage } from "../../utils/generateSearchMessage";

const BrowseBookPage: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const location = useLocation();
    const state = location.state as {
        searchParams?: SearchParams;
        searchResults?: Books[];
        library?: string;
        modalParams?: { criteria?: { idx: string; searchTerm: string }[] };
        acquisitionData?: unknown;
    };

    const [books, setBooks] = useState<Books[]>(state?.searchResults || []);
    const [query, setQuery] = useState<SearchParams | null>(state?.searchParams || null);
    const [source, setSource] = useState(state?.library || "All libraries");

    useEffect(() => {
        setTitle("Browse Books - Library Management System");
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

    const { data: allBooks = [] } = useFetchAllBooks();

    const handleSearch = (searchResults: Books[], library: string, searchQuery: SearchParams) => {
        setBooks(searchResults);
        setSource(library);
        setQuery(searchQuery);
    };

    useEffect(() => {
        if (state?.searchParams && state?.acquisitionData) {
            handleSearch(state.searchResults || [], state.library || "All libraries", state.searchParams);
        }
    }, [state]);

    const searchMessage = generateSearchMessage(query);
    const booksToShow = books.length > 0 ? books : allBooks;

    return (
        <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
            <CustomSearchBar
                onSearch={handleSearch}
                initialQuery={state?.searchParams?.criteria?.find(c => c.idx === "q")?.searchTerm || ""}
                initialLibrary={state?.library || "All libraries"}
                modalParams={state?.modalParams}
            />
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2} marginBottom="30px">
                <Box width="100%">
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {searchMessage} {source !== "All libraries" ? ` in ${source}` : ""}
                    </Typography>
                    <BookGrid books={booksToShow} acquisitionData={state?.acquisitionData} />

                </Box>
            </Box>
        </Container>
    );
};

export default BrowseBookPage;