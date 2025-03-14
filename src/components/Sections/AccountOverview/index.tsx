import { Box, Typography, Divider, Button } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { useFetchUser } from "./useFetchUser";
import { UserData } from "../../../types";

const AccountOverview: React.FC = () => {
    const { id } = useAuth();
    const { data: user } = useFetchUser(id ?? "");
    const userData: UserData | null = user ?? null;

    const fullName = userData
        ? `${userData.firstName} ${userData.middleName ? userData.middleName + " " : ""}${userData.lastName}`
        : "N/A";

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

            {/* Account Statistics */}
            <Box display="flex" flexDirection="column" gap={1} marginBottom={2}>
                <Typography variant="body1"><strong>Borrowed Books:</strong> 1</Typography>
                <Typography variant="body1"><strong>Reserved Books:</strong> 2</Typography>
                <Typography variant="body1"><strong>Outstanding Fines:</strong>3</Typography>
            </Box>

            {/* Actions */}
            <Box display="flex" flexDirection="column" gap={1}>
                <Button variant="contained" sx={{ backgroundColor: "#d32f2f" }}>
                    View Borrowed Books
                </Button>
                <Button variant="outlined" sx={{ borderColor: "#d32f2f", color: "#d32f2f" }}>
                    View Reservations
                </Button>
            </Box>
        </Box>
    );
};

export default AccountOverview;
