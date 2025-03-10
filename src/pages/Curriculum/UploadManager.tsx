import { useEffect, Dispatch, ReactNode, SetStateAction } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { IconButton, Container, Box, Typography, Card, CardContent } from "@mui/material";
import { Menu, Building, GraduationCap, BookOpen, FileText } from "lucide-react";
import { PageTitle } from "../../components";

const CurriculumManagement: React.FC = () => {
    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const navigate = useNavigate();

    useEffect(() => {
        setTitle("Upload Manager - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)}>
                <Menu />
            </IconButton>
        );

        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    return (
        <>
            <PageTitle title="Upload Manager" />

            <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
                {/* <Typography variant="body1">
                    This is your all-in-one tool designed to simplify how you manage
                    and organize your library's academic curriculum. Whether you're an
                    administrator, librarian, or faculty member, this interface is
                    here to help you stay on top of everything.
                </Typography> */}
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                    gap={3}
                    marginBottom="20px"
                >

                    {[
                        {
                            title: "Upload Departments",
                            description: "Import and manage university departments with CSV files, including names and codes.",
                            icon: Building,
                            path: "/admin/curriculum/management/departments"
                        },
                        {
                            title: "Upload Programs",
                            description: "Manage academic programs with details like code, description, and department.",
                            icon: GraduationCap,
                            path: "/admin/curriculum/management/programs"
                        },
                        {
                            title: "Upload Curriculum",
                            description: "Track curriculum changes, including revisions, effectivity semester, and school year.",
                            icon: BookOpen,
                            path: "/admin/curriculum/management/curriculum"
                        },
                        {
                            title: "Upload Courses",
                            description: "Maintain course details like codes, curriculum, and year level with a structured view.",
                            icon: FileText,
                            path: "/admin/curriculum/management/courses"
                        }
                    ].map((item, index) => (
                        <Card
                            key={index}
                            elevation={3}
                            sx={{
                                cursor: "pointer",
                                backgroundColor: "F2F2F2",
                                transition: "0.3s",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: 6,
                                    backgroundColor: "#fff"
                                }
                            }}
                            onClick={() => navigate(item.path)}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center" marginLeft="10px">
                                    <item.icon size={32} color="#D32f2f" />
                                    <Box marginLeft="30px">
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            sx={{ color: "#D32f2f" }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="gray">
                                            {item.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </>
    );
};

export default CurriculumManagement;
