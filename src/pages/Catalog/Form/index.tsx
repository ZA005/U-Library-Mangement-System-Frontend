import { useEffect, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CardComponent from "../../../components/Book/BookCard/catalogingCard";
import FirstPage from "../../../components/Book/BookForm/FirstPage";
import SecondPage from "../../../components/Book/BookForm/SecondPage";


// import two interfaces the acquisition record data and google books api data

// uncomment the line below but update the interfacename

// interface CatalogFormProps {
// data: acquisitiondata | googlebooksapidata;
// }


// change the const Catalog form to the one below

// const CatalogForm: React.FC<CatalogFormProps> = ({ data }) => {

// then pass the data to first page for it to be rendered make sure to fill the data of the card component

const CatalogForm: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    useEffect(() => {
        setTitle("Catalog - Library Management System");
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

    const [page, setPage] = useState(1);

    return (
        <Container maxWidth="md" sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <CardComponent title="TSET" callNumber="123" isbn="123" copyright="123" accessionNumbers="123" />
                {page === 1 ? (
                    <FirstPage onNext={() => setPage(2)} />
                ) : (
                    <SecondPage onBack={() => setPage(1)} />
                )}
            </Paper>
        </Container>
    );
};

export default CatalogForm;
