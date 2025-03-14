
import { Box, Typography, Divider } from "@mui/material";
import BookCarousel from "./BookCarousel";

const FeaturedBooks: React.FC = () => {
    return (
        <Box border="2px solid #EFF3EA" padding={2}>
            <Typography variant="h5" fontWeight="bold">Featured Book</Typography>
            <Divider sx={{ marginY: 1 }} />
            <BookCarousel />
        </Box>
    )
}

export default FeaturedBooks;
