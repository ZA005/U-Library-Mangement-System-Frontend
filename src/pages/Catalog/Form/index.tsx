import { useEffect, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { IconButton, Container, Paper } from "@mui/material";
import { Menu } from "lucide-react";
import CardComponent from "../../../components/Book/BookCard/catalogingCard";
import { FirstPage, SecondPage } from "../../../components";
const CatalogForm: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Catalog - Library Management System");
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
    /**
     * Retrieves book data from the navigation state (if available)
     */
    const location = useLocation();
    const { acquisitionData, googleBookApiData } = location.state || {};
    /**
     * Controls the page state (1 or 2 for the multi-step form)
     */
    const [page, setPage] = useState(1);
    /**
     * Stores form data by merging acquisition and Google API data
     */
    const [formData, setFormData] = useState({ ...acquisitionData, ...googleBookApiData });

    /////////////////////////////////////////////////////////////////////////////////////

    return (
        <Container maxWidth="md" sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <CardComponent thumbnail={formData.thumbnail} title={formData.book_title || formData.title} callNumber={formData.callNumber} isbn={formData.isbn || formData.isbn13} copyright={formData.copyright} accessionNumbers={formData.accessionNumbers} />
                {/* Conditional rendering for the two-page form */}
                {page === 1 ? (
                    <FirstPage onNext={() => setPage(2)} formData={formData} setFormData={setFormData} />
                ) : (
                    <SecondPage onBack={() => setPage(1)} formData={formData} setFormData={setFormData} acquisitionData={acquisitionData} />
                )}
            </Paper>
        </Container>
    );
};

export default CatalogForm;