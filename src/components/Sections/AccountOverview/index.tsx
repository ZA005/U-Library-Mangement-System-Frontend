import { Box, Typography, Divider, Button } from "@mui/material";

const AccountOverview: React.FC = () => {
    const user = {
        name: "John Doe",
        membershipId: "123456",
        borrowedBooks: 3,
        reservedBooks: 2,
        fines: 0,
    };

    return (
        <Box padding={2} border="2px solid #EFF3EA">
            <Typography variant="h5" fontWeight="bold">Account Overview</Typography>
            <Divider sx={{ marginY: 1 }} />

            {/* User Details */}
            <Box marginBottom={2}>
                <Typography variant="body1"><strong>Name:</strong> {user.name}</Typography>
                <Typography variant="body1"><strong>Membership ID:</strong> {user.membershipId}</Typography>
            </Box>

            {/* Account Statistics */}
            <Box display="flex" flexDirection="column" gap={1} marginBottom={2}>
                <Typography variant="body1"><strong>Borrowed Books:</strong> {user.borrowedBooks}</Typography>
                <Typography variant="body1"><strong>Reserved Books:</strong> {user.reservedBooks}</Typography>
                <Typography variant="body1"><strong>Outstanding Fines:</strong> ${user.fines.toFixed(2)}</Typography>
            </Box>

            {/* Actions */}
            <Box display="flex" flexDirection="column" gap={1}>
                <Button variant="contained" sx={{ backgroundColor: "#d32f2f" }}>View Borrowed Books</Button>
                <Button variant="outlined" sx={{ borderColor: "#d32f2f", color: "#d32f2f" }}>View Reservations</Button>
            </Box>
        </Box>
    );
};

export default AccountOverview;
