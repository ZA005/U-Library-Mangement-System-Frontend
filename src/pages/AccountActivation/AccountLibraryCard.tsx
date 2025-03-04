import React, { useEffect, useRef, useState, Dispatch, ReactNode, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../config/routeConfig";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../types";
import { useOutletContext } from "react-router-dom";
import { Typography, Box, Container, List, ListItem, ListItemText, Button } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import LoginIcon from '@mui/icons-material/Login';
import LibraryCard from "../../components/LibraryCard";
import Line from "../../components/Line";
import html2canvas from "html2canvas";

const AccountLibraryCard: React.FC = () => {
    const { setHeaderButtons, setTitle } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    const libraryCardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    /////////////////////////////////////////////////////////////////////////////////////

    const location = useLocation();
    const navigate = useNavigate();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setHeaderButtons(<></>);
        setTitle("Account QR Code - Library Management System");

        if (!location.state || !("userData" in location.state)) {
            navigate(ROUTES.HOME, { replace: true });
            return;
        }

        setUserData(location.state.userData);

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, location.state, navigate]);

    /////////////////////////////////////////////////////////////////////////////////////

    const handleDownload = async () => {
        if (!libraryCardRef.current || !userData) {
            console.error("Library Card element not found or user data missing");
            return;
        }

        setIsDownloading(true);
        try {
            const canvas = await html2canvas(libraryCardRef.current);
            canvas.toBlob((blob) => {
                if (blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `${userData.id}_E-CARD.png`
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }, 'image/png');
        } catch (error) {
            console.error("Error generating the image", error);
        } finally {
            setIsDownloading(false);
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const handleSignIn = () => {
        navigate(ROUTES.HOME);
    };

    if (!userData) {
        return null;
    }

    return (
        <>
            <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
            >
                E-Library Card
            </Typography>

            <Line />

            <Container maxWidth="lg">
                <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4} alignItems="center" justifyContent="space-between" marginBottom="25px">
                    {/* Library Card Section */}
                    <Box ref={libraryCardRef} id="libraryCard">
                        <LibraryCard userData={userData} />
                    </Box>

                    {/* Instructions Section */}
                    <Box flex="1" maxWidth="600px">
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            How to use your E-Library Card
                        </Typography>

                        <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
                            Your library card serves as your official identification for accessing library resources. <br />
                            Please follow these instructions:
                        </Typography>

                        <List>
                            {[
                                "Present your E-Library Card at the library entrance for access.",
                                "Ensure that your E-Library QR is visible when borrowing books or materials.",
                                "For any issues with your E-Library Card, contact the library administration.",
                            ].map((text, index) => (
                                <ListItem key={index} sx={{ padding: 0 }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                                                • {text}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Typography variant="body1" sx={{ marginTop: "1rem", marginBottom: "2rem" }}>
                            To download your library card for digital use, click the "Download E-Library Card" button below.
                        </Typography>

                        {/* Action Buttons */}
                        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                fullWidth
                                onClick={handleDownload}
                                disabled={isDownloading}
                                sx={{ flex: "1 1 auto", height: 56 }}
                            >
                                {isDownloading ? "Downloading..." : "Download Library Card"}
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<LoginIcon />}
                                fullWidth
                                onClick={handleSignIn}
                                sx={{ flex: "1 1 auto", height: 56 }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default AccountLibraryCard;
