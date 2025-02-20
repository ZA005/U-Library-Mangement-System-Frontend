import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const NoCurriculum: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>
                No Curriculum Found
            </Typography>
            <Typography variant="body1" textAlign="center" maxWidth="600px" mb={3}>
                You cannot proceed to upload programs because no curriculums exist.
                Please upload at least one curriculum first.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/admin/curriculum/management/curriculum")}
            >
                Go to Upload Curriculum
            </Button>
        </Box>
    );
};

export default NoCurriculum;
