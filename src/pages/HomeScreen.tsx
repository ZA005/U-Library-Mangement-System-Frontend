import { useEffect, Dispatch, ReactNode, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";
import { Container, Box, Typography, Card, CardContent, CardMedia, Divider } from "@mui/material";
import { useModal } from "../hooks/Modal/useModal";
import { useFetchNewlyAcquired } from "../components/Sections/NewlyAcquiredBooks/useFetchNewlyAcquired";
import { HeaderButtons, SendOTP, Login } from "../components";

const HomeScreen: React.FC = () => {
    const { setHeaderButtons, setTitle } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<string>>;
    }>();

    const loginModal = useModal();
    const verifyModal = useModal();

    const { data: allNewlyAcquired = [] } = useFetchNewlyAcquired()

    const limitedBooks = allNewlyAcquired.slice(0, 4) || [];

    useEffect(() => {
        setHeaderButtons(
            <HeaderButtons
                onLoginClick={loginModal.open}
                onVerifyClick={verifyModal.open}
            />
        );
        setTitle("University Library Management System");

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, loginModal.open, verifyModal.open]);

    return (
        <>

            <Container maxWidth="lg" sx={{ padding: "0" }}>
                {/* Section Title */}
                <Box textAlign="center" mb={2}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#d32f2f",
                            fontWeight: "bold",
                            letterSpacing: "1px",
                        }}
                    >
                        Newly Acquired Books
                    </Typography>
                </Box>

                {/* Static Book Display using CSS Grid */}
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                    gap={3}
                    justifyItems="center"
                >
                    {limitedBooks.map((book, index) => (
                        <Card key={book.id || index} sx={{ width: 200 }}>
                            <CardMedia
                                component="img"
                                height="180"
                                image={book.thumbnail || "https://via.placeholder.com/150"}
                                alt={book.title}
                            />
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {book.authors?.join(", ") || "Unknown Author"}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
                <Divider sx={{ marginTop: 5, marginBottom: 5 }} />
                <Box textAlign="center" mb={2}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#d32f2f",
                            fontWeight: "bold",
                            letterSpacing: "1px",
                        }}
                    >
                        Library Services
                    </Typography>
                </Box>
                <Box mb={4}>
                    <Typography textAlign="justify" fontSize="20px">
                        The University E-Library has been providing services in making researchers, students, faculty members, and the university more driven. The E-Library has a fully air-conditioned facility that features 168 functional computer units with internet connection, both desktop and laptops, Learning Commons, Audio-Visual Room, and Laptop Area. The library is also equipped with 10 CCTV units and has 6 Wi-Fi routers which ensure connectivity in the entire building to enhance educational development and provide educational resources for effective teaching, learning, and research activities.
                    </Typography>
                </Box>
            </Container>

            {/* Modals */}
            <Login open={loginModal.isOpen} onClose={loginModal.close} />
            <SendOTP open={verifyModal.isOpen} onClose={verifyModal.close} />
        </>
    );
};

export default HomeScreen;
