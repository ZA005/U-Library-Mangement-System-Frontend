import { IconButton, Typography, Container, Box, Button, CircularProgress } from "@mui/material";
import React, { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Line } from "../../components";
import { useCSVParser } from "../../hooks/CSVParse/useCSVParser";

const AccessionRecord: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const { isLoading, validateAndParseCSV } = useCSVParser();

    useEffect(() => {
        setTitle("Accession Record - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)}>
                <MenuIcon />
            </IconButton>
        );
        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            validateAndParseCSV(file, "acquisition", (parsedData) => {
                console.log("Parsed CSV Data:", parsedData);
            });
        }
    };

    return (
        <>
            <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
            >
                Accession Record
            </Typography>
            <Line />

            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                <Box width="100%" border="1px solid red">
                    <input
                        type="file"
                        accept=".csv"
                        id="csv-upload"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    <label htmlFor="csv-upload">
                        <Button variant="outlined" component="span" disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} /> : "Choose CSV File"}
                        </Button>
                    </label>

                </Box>
            </Container>
        </>
    );
};

export default AccessionRecord;
