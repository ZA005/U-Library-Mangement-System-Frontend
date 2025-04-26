import React, { useEffect, Dispatch, ReactNode, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Box } from "@mui/material";
import { PageTitle, ECard } from "../../components";
import { useFetchUser } from "../../components/Sections/AccountOverview/useFetchUser";
import { useAuth } from "../../contexts/AuthContext";
import { Menu } from "lucide-react";

const AccountOverview: React.FC = () => {
    const { id } = useAuth()
    const { data: userData } = useFetchUser(id!);

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Oversee Overdues - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)}>
                <Menu color="#d32f2f" />
            </IconButton>
        );
        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    /////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <PageTitle title="Account Overview" />
            {userData && (
                <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                    <ECard userData={userData} />
                </Container>
            )}
        </>
    )
}

export default AccountOverview