import { Button, Box } from "@mui/material";

interface ActionButtonsProps {
    role: string | null;
}
// add here the functions for the buttons
const ActionButtons: React.FC<ActionButtonsProps> = ({ role }) => {
    return (
        <Box display="flex" gap={2} mt={1} mb={2}>
            {role === "STUDENT" ? (
                <>
                    <Button variant="contained" sx={{ backgroundColor: "#d32f2f" }}>Borrow</Button>
                    <Button variant="outlined" sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}>Reserve</Button>
                </>
            ) : (
                <Button variant="contained" sx={{ backgroundColor: "#d32f2f" }}>Catalog</Button>
            )}
        </Box>
    );
};

export default ActionButtons;
