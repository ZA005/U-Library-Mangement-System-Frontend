import React from "react";
import { useNavigate } from "react-router-dom";
import { GENERAL_ROUTES } from "../../config/routeConfig";
import { Box, Typography, Button } from "@mui/material";

interface NoDataPageProps {
    missingEntity?: string;
    dependentEntity?: string;
}

const NoDataPage: React.FC<NoDataPageProps> = ({ missingEntity, dependentEntity }) => {
    const navigate = useNavigate();
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>
                No {missingEntity} Found
            </Typography>
            <Typography variant="body1" textAlign="center" maxWidth="600px" mb={3}>
                You cannot proceed to upload {dependentEntity} because no {missingEntity} exists.
                Please upload at least one department first.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(GENERAL_ROUTES.HOME)}
            >
                Return
            </Button>
        </Box>
    );
};


export default NoDataPage;