import { useEffect, Dispatch, ReactNode, SetStateAction } from "react";
import { Typography, Button } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import Line from "../components/Line/Line";

const HomeScreen: React.FC = () => {
    const { setHeaderButtons, setTitle } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
    }>();

    useEffect(() => {
        setHeaderButtons(
            <>
                <Button variant="outlined" sx={{ color: '#d32f2f', borderColor: ' #d32f2f', marginRight: '10px' }}>
                    Activate Account
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#d32f2f' }}>
                    Sign In
                </Button>
            </>
        );

        setTitle("Home - Library Management System");

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle]);

    return (
        <>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                fontWeight="bold"
            >
                Library Management System
            </Typography>
            <Line />
        </>
    );
};

export default HomeScreen;
