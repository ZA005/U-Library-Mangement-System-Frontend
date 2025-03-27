import { useEffect, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { IconButton, Container, Box } from "@mui/material";
import CustomSearchBar from "../../components/CustomSearchBar";
import { useFetchAllBooks } from "../../components/Sections/BrowseBooks/useFetchAllBooks";
import BookGrid from "../../components/Book/BookGrid";
import { Menu } from "lucide-react";
import { Books } from "../../types";
import { AdvanceSearchParams } from "../../types/Catalog/advanceSearchParams";

const BrowseBookPage: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const location = useLocation();
    const state = location.state as { searchParams: AdvanceSearchParams, searchResults?: Books[], library: string };

    useEffect(() => {
        setTitle("Browse Books - Library Management System");
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

    const { data: allBooks = [] } = useFetchAllBooks();
    const [books, setBooks] = useState<Books[]>(state?.searchResults || []);
    const [, setQuery] = useState<AdvanceSearchParams | null>(state?.searchParams || null);
    const [, setSource] = useState(state?.library || "All libraries");
    const booksToShow = books.length > 0 ? books : allBooks;

    const handleSearch = (searchResults: Books[], library: string, query: AdvanceSearchParams) => {
        setBooks(searchResults);
        setSource(library);
        setQuery(query);
    }

    return (
        <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
            <CustomSearchBar onSearch={handleSearch} />
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2} marginBottom="30px">
                <BookGrid books={booksToShow} />
            </Box>
        </Container>
    );
};

export default BrowseBookPage;