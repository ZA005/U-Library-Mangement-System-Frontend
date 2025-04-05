import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";
import { Books } from "../../../types";

interface ActionButtonsProps {
    role: string | null;
    book?: Books;
    acquisitionData?: unknown;
}
// add here the functions for the buttons
const ActionButtons: React.FC<ActionButtonsProps> = ({ role, book, acquisitionData }) => {
    const navigate = useNavigate();
    const handleCatalogClick = () => {
        navigate(PROTECTED_ROUTES.CATALOG, {
            state: {
                googleBookApiData: book,
                acquisitionData
            }
        });
    };
    return (
        <Box display="flex" gap={2} mt={1} mb={2}>
            {role === "STUDENT" ? (
                <>
                    <Button variant="contained" sx={{ backgroundColor: "#d32f2f" }}>Borrow</Button>
                    <Button variant="outlined" sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}>Reserve</Button>
                </>
            ) : (
                <Button variant="contained" onClick={handleCatalogClick} sx={{ backgroundColor: "#d32f2f" }}>Catalog</Button>
            )}
        </Box>
    );
};

export default ActionButtons;
