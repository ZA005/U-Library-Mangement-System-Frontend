import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const NoProgram: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>
                No Programs Found!
            </Typography>
            <Typography variant="body1" textAlign="center" maxWidth="600px" mb={3}>
                You cannot proceed to upload programs because no programs exist.
                Please upload at least one program first.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/admin/curriculum/management/courses")}
            >
                Go to Upload Programs
            </Button>
        </Box>
    );
};

export default NoProgram;
