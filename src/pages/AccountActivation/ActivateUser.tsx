import React, { useEffect, Dispatch, ReactNode, SetStateAction } from "react";
import { useLocation, useNavigate, generatePath, useOutletContext } from "react-router-dom";
import { ROUTES } from "../../routes/routeConfig";
import { Typography, Box, TextField, Container, Button, Divider } from "@mui/material";
import { UserData, AccountData } from "../../types";
import { useRegister } from "./useRegister";
import Line from "../../components/Line";

const ActivateUser: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const location = useLocation();
    const navigate = useNavigate();

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
    }>();


    useEffect(() => {
        setHeaderButtons(<></>);
        setTitle("Verify - Library Management System");

        if (!location.state || !(location.state as { userData: UserData }).userData) {
            // Redirect or display an error if the component is accessed directly without proper state.
            navigate(ROUTES.HOME);
        }

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, location.state, navigate]);

    const { userData } = location.state as { userData: UserData };
    const { register } = useRegister();

    const fullName = `${userData.firstName} ${userData.middleName} ${userData.lastName} ${userData.suffix}`;
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const account: AccountData = {
            user_id: userData.id,
            password: password,
            role: userData.role.toUpperCase(),
        };

        register(
            { account },
            {
                onSuccess: () => {
                    console.log("Account activated successfully!");
                    const path = generatePath(ROUTES.ELIBCARD, { user_id: userData.id });
                    navigate(path, { state: { userData } });
                }
            }
        );
    };
    return (
        <>
            <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
            >
                Account Verification
            </Typography>
            <Line />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box
                    component="form"
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    sx={{ border: "1px solid #C4C4C4", padding: "20px", borderRadius: "10px" }}
                >
                    {/* Account Information */}
                    <Typography variant="h6" fontWeight="bold">
                        Account Information
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Account ID" fullWidth value={userData?.id || ""} disabled required />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Account Type" fullWidth defaultValue={userData.role.toUpperCase()} disabled required />
                        </Box>
                    </Box>

                    <Divider />

                    {/* Personal Information */}
                    <Typography variant="h6" fontWeight="bold">
                        Personal Information
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        {/* Full-width on all breakpoints */}
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 100%" } }}>
                            <TextField label="Name" fullWidth value={fullName.toUpperCase()} disabled required />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Department" fullWidth value={userData.department.toUpperCase()} disabled required />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Program" fullWidth value={userData.program.toUpperCase() || "N/A"} disabled required />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Email Address" fullWidth value={userData.emailAdd} disabled required />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Contact Number" fullWidth value={userData.contactNo} disabled required />
                        </Box>
                    </Box>

                    <Divider />

                    {/* Security Information */}
                    <Typography variant="h6" fontWeight="bold">
                        Security Information
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField
                                label="Password"
                                fullWidth
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField
                                label="Confirm Password"
                                fullWidth
                                required
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleSubmit()}
                    >
                        Submit
                    </Button>

                </Box>
            </Container>
        </>
    );
};

export default ActivateUser;
