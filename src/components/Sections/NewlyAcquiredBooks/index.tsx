import { Box, Typography, Divider } from "@mui/material";
import BookGrid from "../../Book/BookGrid";
import { useFetchNewlyAcquired } from "./useFetchNewlyAcquired";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";
import { useNavigate } from "react-router-dom";
const NewlyAcquiredBooks: React.FC = () => {

    const { data: allNewlyAcquired = [] } = useFetchNewlyAcquired()

    const limitedBooks = allNewlyAcquired.slice(0, 4) || [];

    const navigate = useNavigate()
    return (
        <Box border="2px solid #EFF3EA" padding={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold">Newly Acquired Books</Typography>
                <Typography
                    variant="caption"
                    sx={{ cursor: "pointer", color: "#d32f2f" }}
                    onClick={() => navigate(PROTECTED_ROUTES.NEWLYACQUIRED)}
                >
                    View More
                </Typography>
            </Box>

            <Divider sx={{ marginY: 1 }} />
            <BookGrid books={limitedBooks} />
        </Box>
    );
};

export default NewlyAcquiredBooks;
