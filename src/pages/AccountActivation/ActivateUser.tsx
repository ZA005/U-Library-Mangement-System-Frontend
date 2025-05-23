import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { GENERAL_ROUTES } from "../../config/routeConfig";
import { Typography, Box, TextField, Container, Button, Divider, IconButton } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { UserData, AccountData } from "../../types";
import { useRegister } from "./useRegister";
import Line from "../../components/PageTitle";

const ActivateUser: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const location = useLocation();
    const navigate = useNavigate();
    const { register } = useRegister();

    /////////////////////////////////////////////////////////////////////////////////////

    const [userData, setUserData] = useState<UserData | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle } = useOutletContext<{
        setHeaderButtons: React.Dispatch<React.SetStateAction<React.ReactNode>>;
        setTitle: React.Dispatch<React.SetStateAction<string>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setHeaderButtons(null);
        setTitle("Verify - Library Management System");

        if (!location.state?.userData) {
            navigate(GENERAL_ROUTES.HOME, { replace: true });
            return;
        }

        setUserData(location.state.userData);

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, location.state, navigate]);

    /////////////////////////////////////////////////////////////////////////////////////

    const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    /////////////////////////////////////////////////////////////////////////////////////

    const handleSubmit = async () => {
        if (!userData) {
            navigate(GENERAL_ROUTES.HOME, { replace: true });
            return;
        }

        setErrors({ password: "", confirmPassword: "" });

        const { default: validatePassword } = await import("../../utils/validatePassword");

        const passwordError = validatePassword(password);

        if (passwordError) {
            setErrors((prev) => ({ ...prev, password: passwordError }));
            return;
        }

        if (password !== confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
            return;
        }

        const account: AccountData = {
            user_id: userData.id,
            password,
            role: userData.role.toUpperCase(),
        };

        register(
            { account },
            {
                onSuccess: () => {
                    console.log("Account activated successfully!");
                    navigate(GENERAL_ROUTES.ELIBCARD.replace(":user_id", userData.id), { state: { userData } });

                },
            }
        );
    };

    if (!userData) return null;

    /////////////////////////////////////////////////////////////////////////////////////

    const fullName = `${userData.firstName} ${userData.middleName || ""} ${userData.lastName} ${userData.suffix || ""}`.trim();

    return (
        <>
            <Line title="Account Verification" />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box component="form" display="flex" flexDirection="column" gap={3} sx={{ border: "1px solid #C4C4C4", padding: "20px", borderRadius: "10px" }}>
                    <Typography variant="h6" fontWeight="bold">Account Information</Typography>
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Account ID" fullWidth value={userData?.id || ""} disabled required />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Account Type" fullWidth defaultValue={userData.role.toUpperCase()} disabled required />
                        </Box>
                    </Box>

                    <Divider />

                    <Typography variant="h6" fontWeight="bold">Personal Information</Typography>
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 100%" } }}>
                            <TextField label="Name" fullWidth value={fullName.toUpperCase()} disabled required />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Department" fullWidth value={userData.department.toUpperCase()} disabled required />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Program" fullWidth value={userData.program?.toUpperCase() || "N/A"} disabled required />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Email Address" fullWidth value={userData.emailAdd} disabled required />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField label="Contact Number" fullWidth value={userData.contactNo} disabled required />
                        </Box>
                    </Box>

                    <Divider />

                    <Typography variant="h6" fontWeight="bold">Security Information</Typography>
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField
                                label="Password"
                                fullWidth
                                required
                                type={showPassword.password ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => togglePasswordVisibility("password")} edge="end">
                                            {showPassword.password ? <EyeOff /> : <Eye />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
                            <TextField
                                label="Confirm Password"
                                fullWidth
                                required
                                type={showPassword.confirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />
                        </Box>

                    </Box>

                    <Button variant="contained" fullWidth onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default ActivateUser;
