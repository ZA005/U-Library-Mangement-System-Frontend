import React from 'react';
import { Typography } from '@mui/material';

interface LineProps {
    title: string;
}

const PageTitle: React.FC<LineProps> = ({ title }) => {
    return (
        <>
            <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
            >
                {title}
            </Typography>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "#d32f2f",
                width: "8vw",
                height: "1vw",
                marginTop: "10px",
                marginBottom: "25px"
            }}>
                <div style={{
                    backgroundColor: "#d32f2f",
                    width: "35vw",
                    height: "0.1vw",
                }}></div>
            </div>
        </>

    );
};

export default PageTitle;