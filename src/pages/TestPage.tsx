import { useEffect, Dispatch, ReactNode, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";
import { Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const TestPage: React.FC = () => {
    const { setHeaderButtons, setTitle } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
    }>();

    useEffect(() => {
        setTitle("Testing Page");
        setHeaderButtons(
            <IconButton color="inherit">
                <MenuIcon />
            </IconButton>
        );

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle]);

    return (
        <>
            <Typography>Hello world</Typography>
        </>
    );
};

export default TestPage;
