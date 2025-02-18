import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import elibLogo from "../assets/images/lms-logo.png"
const PageNotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Helmet>
                <title>Page Not Found</title>
                <meta charSet='utf-8' />
                <link rel='icon' type='image/png' href={elibLogo} />
            </Helmet>
            <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
                <Typography variant="h1" color="error" fontWeight="bold">
                    404
                </Typography>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={3}>
                    The page you are looking for does not exist.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoBack}>
                    Go Back
                </Button>
            </Container>
        </>

    );
};

export default PageNotFound;
