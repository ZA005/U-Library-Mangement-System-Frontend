import { Card, CardContent, CardMedia, Typography, Box, Button } from "@mui/material";
import { Books } from "../../../types";
import { useLocation, useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "../../../config/routeConfig";
interface BookCardProps {
    book: Books;
    acquisitionData?: unknown;
}

const CardComponent: React.FC<BookCardProps> = ({
    book,
    acquisitionData
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const authorsList = book.authors.map((author) => author.name || String(author)).join(", ");

    const handleViewBook = () => {
        navigate(PROTECTED_ROUTES.BOOKINFORMATION.replace(":isbn", book.isbn13 || book.isbn10), {
            state: {
                book,
                acquisitionData: acquisitionData || location.state?.acquisitionData,
                googleBookApiData: book
            }
        })
    };

    return (
        <Card
            sx={{
                display: "flex",
                alignItems: "center",
                height: "150px",
                padding: 2,
                borderRadius: 2,
                boxShadow: 2
            }}
        >
            {/* Thumbnail */}
            <CardMedia
                component="img"
                image={book.thumbnail}
                alt={book.title}
                sx={{
                    width: 90,
                    height: 130,
                    objectFit: "cover",
                    borderRadius: 1,
                    flexShrink: 0,
                    marginRight: 2
                }}
            />

            {/* Book Details */}
            <CardContent sx={{ flex: 1, padding: 0 }}>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden"
                    }}
                >
                    {book.title}
                </Typography>
                <Box>
                    <Typography variant="body2"
                        sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                            overflow: "hidden",
                            color: "text.secondary"
                        }}
                    >
                        <strong>Author(s):</strong> {authorsList || "Unknown"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        <strong>ISBN:</strong> {book.isbn13}
                    </Typography>
                    <Typography variant="body2" paddingBottom="10px">
                        <strong>Status:</strong>{" "}
                        <span
                            style={{
                                color:
                                    book.status === "AVAILABLE"
                                        ? "green"
                                        : book.status === "LOANED_OUT"
                                            ? "red"
                                            : "text.primary",
                                fontWeight: "bold"
                            }}
                        >
                            {book.status === "LOANED_OUT" ? "LOANED OUT" : book.status}
                        </span>
                    </Typography>

                    <Button sx={{ padding: "0", lineHeight: "0" }} onClick={handleViewBook}>
                        View Book
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CardComponent;
