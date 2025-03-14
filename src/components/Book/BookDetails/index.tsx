import { useState } from "react";
import { Books } from "../../../types";
import { Box, Card, Typography, Divider } from "@mui/material";
import ActionButtons from "./ActionButtons";
interface BookDetailsProps {
    role: string | null;
    book: Books;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, role }) => {

    const [expanded, setExpanded] = useState(false);
    const shortDescription = book.description ? book.description.slice(0, 300) + "..." : "";
    const thumbnailInfo = book.thumbnail?.trim() ? book.thumbnail : "https://dummyimage.com/1000x1600/000/fff";
    return (
        <Card sx={{ width: "800px", margin: "20px auto", padding: "20px" }}>
            <Box
                sx={{
                    display: "grid",
                    gap: "20px",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" },
                    alignItems: "center",
                }}
            >
                <Box
                    component="img"
                    src={thumbnailInfo}
                    alt={book.title}
                    sx={{
                        width: "100%",
                        maxWidth: "200px",
                        height: "auto",
                        borderRadius: "10px",
                        boxShadow: 3,
                        justifySelf: { xs: "center", sm: "start" },
                    }}
                />

                <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Typography variant="h5" fontWeight="bold">
                        {book.title}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Authors:</strong> {book.authors.join(", ")}
                    </Typography>
                    <Typography variant="body2">
                        <strong>ISBN-10:</strong> {book.isbn10} | <strong>ISBN-13:</strong> {book.isbn13}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Edition:</strong> {book.edition} {book.series && `- ${book.series}`}
                    </Typography>

                    <ActionButtons role={role} />
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {book.description && (
                <>
                    <Typography variant="body2" color="text.secondary">
                        {expanded ? book.description : shortDescription}
                    </Typography>

                    {book.description.length > 100 && (
                        <Typography
                            variant="body2"
                            color="primary"
                            sx={{ cursor: "pointer", mt: 1 }}
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? "Show Less" : "Load More"}
                        </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />
                </>
            )}
            <Typography variant="h6" fontWeight="bold" sx={{ my: 2 }}>Book Information</Typography>
            <Box sx={{ display: "grid", gap: "10px", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <Box>
                    <Typography variant="body1">
                        <strong>Pages:</strong> {book.pages}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Language:</strong> {book.language}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Publisher:</strong> {book.publisher}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Published Date:</strong> {book.publishedDate}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body1">
                        <strong>Print Type:</strong> {book.printType}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Copyright:</strong> {book.copyRight}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Language:</strong> {book.language}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight="bold" sx={{ my: 2 }}>Catalog Information</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <Box>
                    <Typography variant="body1">
                        <strong>Call Number:</strong> {book.bookCatalog.callNumber}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Collection Type:</strong> {book.bookCatalog.collectionType}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body1">
                        <strong>Copies Available:</strong> {book.bookCatalog.copies}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Publisher:</strong> {book.publisher}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default BookDetails;
