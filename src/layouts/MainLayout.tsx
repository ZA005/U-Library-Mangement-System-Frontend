import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [headerButtons, setHeaderButtons] = useState<React.ReactNode>(null);
    const [title, setTitle] = useState<React.ReactNode>("");

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            sx={{
                overflowX: "hidden",
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    px: { xs: 2, sm: 4, md: 6 }
                }}
            >
                <Header buttons={headerButtons} title={title} />
                {/* Pass setHeaderButtons as context without LayoutContext */}
                <Outlet context={{ setHeaderButtons, setTitle }} />
                {children}
            </Container>
            <Footer />
        </Box>
    );
};

export default MainLayout;
