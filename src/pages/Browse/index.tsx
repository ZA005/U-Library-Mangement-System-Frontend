import { useEffect, Dispatch, ReactNode, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { PageTitle } from "../../components";

const Browse: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    useEffect(() => {
        setTitle("Browse");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen(prev => !prev)}>
                <MenuIcon />
            </IconButton>
        );

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    return (
        <>
            <PageTitle title="Browse Books" />

        </>
    );
};

export default Browse;
