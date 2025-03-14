import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface BookCardProps {
    thumbnail?: string;
    title: string;
    callNumber: string;
    isbn: string;
    copyright: string;
    accessionNumbers: string;
}

const CardComponent: React.FC<BookCardProps> = ({
    thumbnail,
    title,
    callNumber,
    isbn,
    copyright,
    accessionNumbers
}) => {
    const thumbnailInfo = thumbnail || "https://dummyimage.com/1600x2560/000/fff";
    return (
        <Card
            sx={{
                display: "flex",
                alignItems: "center",
                height: "150px",
                padding: 2,
                borderRadius: 2,
                boxShadow: 2,
                marginBottom: 3
            }}
        >
            {/* Thumbnail */}
            <CardMedia
                component="img"
                image={thumbnailInfo}
                alt="thumbnail"
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
                    fontWeight="bold"
                    sx={{
                        fontSize: {
                            xs: "1.5rem",
                            sm: "1.5rem",
                            md: "1.5rem",
                            lg: "2rem",
                            xl: "2.5rem",
                        },
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden"
                    }}
                >
                    {title}
                </Typography>
                <Typography variant="body2"
                    sx={{
                        color: "text.secondary",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden"
                    }}
                >
                    <strong>Call Number:</strong> {callNumber}
                </Typography>
                <Typography variant="body2"
                    sx={{
                        color: "text.secondary",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden"
                    }}
                >
                    <strong>ISBN:</strong> {isbn}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Copyright:</strong> {copyright}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Accession Numbers:</strong> {accessionNumbers}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CardComponent;
