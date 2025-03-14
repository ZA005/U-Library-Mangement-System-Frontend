import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { Footer, Header, Copyright } from "../components";
import { GENERAL_ROUTES } from "../config/routeConfig";

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [headerButtons, setHeaderButtons] = useState<React.ReactNode>(null);
    const [title, setTitle] = useState<React.ReactNode>("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const isPublicRoute = Object.values(GENERAL_ROUTES).includes(location.pathname);

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            sx={{ overflowX: "hidden" }}
        >
            <Container
                maxWidth="lg"
                sx={{ flexGrow: 1, px: { xs: 2, sm: 4, md: 6 } }}
            >
                <Header
                    buttons={headerButtons}
                    title={title}
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                />
                <Outlet context={{ setHeaderButtons, setTitle, setSidebarOpen }} />
                {children}
            </Container>
            {isPublicRoute ? <Footer /> : <Copyright />}
        </Box>
    );
};

export default MainLayout;
