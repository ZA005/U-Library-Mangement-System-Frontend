import { useEffect, useState, Dispatch, ReactNode, SetStateAction } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { IconButton, Container, Box, Typography, Button, Collapse, Divider } from "@mui/material";
import { BookDetails, PageTitle } from "../../../components";
import { useAuth } from "../../../contexts/AuthContext";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";
import BookGrid from "../../../components/Book/BookGrid";

// add here the api call of fetching books via author then pass the books to the bookgrid
const CatalogBookInformation: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { role } = useAuth();
    const location = useLocation();
    const book = location.state?.book;
    const navigate = useNavigate();

    // State for expanding/collapsing the "More on this author" section
    const [showMoreBooks, setShowMoreBooks] = useState(false);

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if (!book) {
            navigate(PROTECTED_ROUTES.BROWSE, { replace: true });
            return;
        }
        setTitle(`${book.title} - Library Management System`);
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen(prev => !prev)}>
                <Menu color="#d32f2f" />
            </IconButton>
        );

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen, book, navigate]);

    /////////////////////////////////////////////////////////////////////////////////////

    return (
        <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
            <PageTitle title="Book Details" />
            <Box display="flex" justifyContent="center">
                {book ? <BookDetails book={book} role={role} /> : <p>No book details available</p>}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        More on this author
                    </Typography>

                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => setShowMoreBooks(prev => !prev)}
                        sx={{ mt: 1, mb: 2, color: "#d32f2f" }}
                    >
                        {showMoreBooks ? "Show Less" : "Show More"}
                    </Button>
                </Box>

                <Collapse in={showMoreBooks} timeout="auto" unmountOnExit>
                    {/* Bookgrid */}
                </Collapse>
            </Box>


        </Container>
    );
};

export default CatalogBookInformation;
