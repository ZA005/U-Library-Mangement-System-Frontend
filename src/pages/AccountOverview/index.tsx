import React, { useEffect, Dispatch, ReactNode, SetStateAction, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IconButton, Container, Box, Card, CardContent, Typography } from "@mui/material";
import { PageTitle, ECard } from "../../components";
import { useFetchUser } from "../../components/Sections/AccountOverview/useFetchUser";
import { useUploadUsers } from "./useUploadUsers";
import { useSnackbarContext } from "../../contexts/SnackbarContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCSVParser } from "../../hooks/CSVParse/useCSVParser";
import { Download, History, Lock, Upload, Menu } from "lucide-react";
import { PROTECTED_ROUTES } from "../../config/routeConfig";
import html2canvas from "html2canvas";
import NewPassword from "../../components/Modal/ForgotPassword/NewPassword";

const AccountOverview: React.FC = () => {
    const { id, role } = useAuth();
    const { data: userData } = useFetchUser(id!);
    const libraryCardRef = useRef<HTMLDivElement>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const showSnackbar = useSnackbarContext();
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Account Management - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)}>
                <Menu color="#d32f2f" />
            </IconButton>
        );
        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    /////////////////////////////////////////////////////////////////////////////////////

    const handleDownloadQRCode = async () => {
        console.log("TEST1")
        if (!libraryCardRef.current) {
            console.error("QR Code element not found");
            return;
        }
        console.log("TEST2")
        try {
            const canvas = await html2canvas(libraryCardRef.current);
            canvas.toBlob((blob) => {
                if (blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `${id}_E-Card.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }, 'image/png');
        } catch (error) {
            console.error("Error generating the QR code image", error);
        }
    };

    const { uploadUsers } = useUploadUsers()
    const { isLoading, validateAndParseCSV } = useCSVParser();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await validateAndParseCSV(file, 'users', (parsedData) => {
                uploadUsers(parsedData, {
                    onSuccess: () => {
                        showSnackbar("CSV Parsed Successfully!", "success");
                    },
                    onError: (error) => showSnackbar(`${error}`, "error"),
                })
            });
        } catch (error) {
            console.error(error)
        } finally {
            setIsUploading(false);
            (event.target as HTMLInputElement).value = "";
        }
    };

    return (
        <>
            <PageTitle title="Account Management" />
            {userData && (
                <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", md: "row" }}
                        gap={4}
                        alignItems="center"
                        justifyContent="space-between"
                        marginBottom="25px"
                    >
                        {/* ECard */}
                        <Box
                            ref={libraryCardRef}
                            sx={{
                                display: "flex",
                                justifyContent: {
                                    xs: "center",
                                    md: "flex-start",
                                },
                            }}
                        >
                            <ECard userData={userData} />
                        </Box>

                        {/* Cards as buttons */}
                        <Box
                            display="grid"
                            gap="10px"
                            sx={{
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                },
                                justifyContent: {
                                    md: "flex-start",
                                },
                            }}
                        >
                            {[
                                {
                                    title: "Download QR Code",
                                    description: "Download your unique QR code.",
                                    icon: Download,
                                    action: handleDownloadQRCode,
                                },
                                {
                                    title: "View Transaction History",
                                    description: "See your transaction history.",
                                    icon: History,
                                    path: PROTECTED_ROUTES.INDIVIDUAL_HISTORY.replace(":user_id", id!),
                                },
                                {
                                    title: "Change Password",
                                    description: "Update your account password.",
                                    icon: Lock,
                                    action: () => setShowPasswordModal(true),
                                },
                                ...(role === "LIBRARYDIRECTOR"
                                    ? [
                                        {
                                            title: "Upload Users",
                                            description: "Upload users to the database.",
                                            icon: Upload,
                                            action: () => {
                                                document.getElementById("csvFileInput")?.click();
                                            },
                                        },
                                    ]
                                    : []),
                            ].map((item, index) => (
                                <Card
                                    key={index}
                                    elevation={3}
                                    sx={{
                                        cursor: "pointer",
                                        backgroundColor: "F2F2F2",
                                        transition: "0.3s",
                                        "&:hover": {
                                            transform: "scale(1.02)",
                                            boxShadow: 6,
                                            backgroundColor: "#fff",
                                        },
                                    }}
                                    onClick={() => {
                                        if (item.action) {
                                            item.action();
                                        } else if (item.path) {
                                            window.open(item.path, "_blank");
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center" marginLeft="10px">
                                            <item.icon size={32} color="#D32f2f" />
                                            <Box marginLeft="30px">
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    sx={{ color: "#D32f2f" }}
                                                >
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="body2" color="gray">
                                                    {item.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                </Container>
            )}
            <input
                id="csvFileInput"
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleFileUpload}
            />
            {/* Password Modal */}
            {showPasswordModal && (
                <NewPassword
                    open={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    mode="change"
                    userId={id!}
                />
            )}


        </>
    );
};

export default AccountOverview;
