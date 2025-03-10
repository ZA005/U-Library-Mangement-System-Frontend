import { Card, CardContent, CardMedia, Typography, Box, Button } from "@mui/material";

interface BookCardProps {
    thumbnail: string;
    title: string;
    authors: string;
    isbn: string;
    publisher: string;
    copiesAvailable: number;
}

const CardComponent: React.FC<BookCardProps> = ({
    thumbnail,
    title,
    authors,
    isbn,
    publisher,
    copiesAvailable
}) => {
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
                image={thumbnail}
                alt={title}
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
                    {title}
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
                        <strong>Author(s):</strong> {authors}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        <strong>ISBN:</strong> {isbn}
                    </Typography>
                    <Typography variant="body2" paddingBottom="10px">
                        <strong>Copies Available:</strong> {copiesAvailable}
                    </Typography>
                    <Button sx={{ padding: "0", lineHeight: "0", }}>view book</Button>
                </Box>


            </CardContent>
        </Card>
    );
};

export default CardComponent;
