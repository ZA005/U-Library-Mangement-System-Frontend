import { useEffect, Dispatch, ReactNode, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";
import { Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Catalog: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    useEffect(() => {
        setTitle("Catalog Page");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen(prev => !prev)}>
                <MenuIcon sx={{ color: "d32f2f" }} />
            </IconButton>
        );

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    return (
        <>
            <Typography>Catalog</Typography>
        </>
    );
};

export default Catalog;
