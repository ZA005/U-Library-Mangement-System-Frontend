import { useEffect, Dispatch, ReactNode, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";
import { useModal } from "../hooks/Modal/useModal";
import { HeaderButtons, PageTitle, SendOTP, Login } from "../components";

const HomeScreen: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    const loginModal = useModal();
    const verifyModal = useModal();

    /////////////////////////////////////////////////////////////////////////////////////

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

    /////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <PageTitle title="Library Management System" />

            {/* Modals */}
            <Login open={loginModal.isOpen} onClose={loginModal.close} />
            <SendOTP open={verifyModal.isOpen} onClose={verifyModal.close} />
        </>
    );
};

export default HomeScreen;
