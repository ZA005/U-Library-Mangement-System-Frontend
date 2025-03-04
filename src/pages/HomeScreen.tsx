import { useEffect, Dispatch, ReactNode, SetStateAction } from "react";
import { Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useModal } from "../hooks/Modal/useModal";
import { HeaderButtons, Line, SendOTP, Login } from "../components";

const HomeScreen: React.FC = () => {
    const { setHeaderButtons, setTitle } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
    }>();

    const loginModal = useModal();
    const verifyModal = useModal();

    useEffect(() => {
        setHeaderButtons(
            <HeaderButtons
                onLoginClick={loginModal.open}
                onVerifyClick={verifyModal.open}
            />
        );

        setTitle("University Library Management System");

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, loginModal.open, verifyModal.open]);

    return (
        <>
            <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
            >
                Library Management System
            </Typography>
            <Line />

            {/* Modals */}
            <Login open={loginModal.isOpen} onClose={loginModal.close} />
            <SendOTP open={verifyModal.isOpen} onClose={verifyModal.close} />
        </>
    );
};

export default HomeScreen;
