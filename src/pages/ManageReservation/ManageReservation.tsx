import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer'; 
import Line from "../../components/Line/Line";
import styles from "./styles.module.css";

const ManageReservation: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Header buttons={<></>} />

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
                    fontWeight="bold"
                >
                   Manage Reservation
                </Typography>
                <Line />
            </Container>

            <Footer />
        </Box>
    );
};

export default ManageReservation;
