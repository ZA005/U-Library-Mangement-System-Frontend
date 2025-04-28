import { Box, Typography, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useFetchUser } from "./useFetchUser";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";
import { useFetchIndividualFine } from "./useFetchIndividualFine";
import { UserData } from "../../../types";
import { AlertCircle } from "lucide-react";

const AccountOverview: React.FC = () => {
    const navigate = useNavigate();
    const { id, role } = useAuth();
    const { data: user } = useFetchUser(id ?? "");
    const userData: UserData | null = user ?? null;

    const { data: fine } = useFetchIndividualFine(id!);

    const fullName = userData
        ? `${userData.firstName} ${userData.middleName ? userData.middleName + " " : ""}${userData.lastName}`
        : "N/A";

    // Check if the role is either STUDENT or FACULTY
    const isEligibleRole = role === "STUDENT" || role === "FACULTY";

    return (
        <Box padding={2} border="2px solid #EFF3EA">
            <Typography variant="h5" fontWeight="bold">Account Overview</Typography>
            <Divider sx={{ marginY: 1 }} />

            {/* User Details */}
            <Box marginBottom={2}>
                <Typography variant="body1"><strong>ID:</strong> {id}</Typography>
                <Typography variant="body1"><strong>Account:</strong> {userData?.role}</Typography>
                <Typography variant="body1"><strong>Name:</strong> {fullName}</Typography>
            </Box>

            <Divider sx={{ marginBottom: "20px" }} />

            {/* Account Statistics - Show only for STUDENT or FACULTY */}
            {isEligibleRole && (
                <Box display="flex" flexDirection="column" gap={1} marginBottom={2} justifyContent="center" alignItems="center">
                    <AlertCircle size={50} color="#d32f2f" />
                    <Typography variant="body1"><strong>Outstanding Fines</strong></Typography>
                    <Typography variant="body1" color="#d32f2f" fontSize="40px"><strong>₱ {fine?.toFixed(2)}</strong></Typography>
                </Box>
            )}

            {/* Actions - Show only for STUDENT or FACULTY */}
            {isEligibleRole && (
                <Box display="flex" flexDirection="column" gap={1}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#d32f2f" }}
                        onClick={() => navigate(PROTECTED_ROUTES.ACCOUNT_OVERVIEW)}
                    >
                        Account Management
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default AccountOverview;
