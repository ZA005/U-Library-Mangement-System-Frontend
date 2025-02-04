// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Box, Typography, Container, IconButton, Button, Divider, TextField } from "@mui/material";
// import { Subject, getAllSubjectsByProgram } from "../../services/Curriculum/SubjectService";
// import { BookReference, getAllBookRefBySubject } from "../../services/Curriculum/BookReferenceService";
// import Header from "../../components/Header/Header";
// import Copyright from "../../components/Footer/Copyright";
// import Line from "../../components/Line/Line";
// import MenuIcon from "@mui/icons-material/Menu";
// import Sidebar from "../../components/Sidebar";

// const ProgramPage: React.FC = () => {
//     const [isSidebarOpen, setSidebarOpen] = useState(false);
//     const [selectedBooks, setSelectedBooks] = useState<BookReference[] | null>(null);
//     const [searchQuery, setSearchQuery] = useState("");

//     const location = useLocation();
//     const program = location.state?.program;

//     const [subjects, setSubjects] = useState<Subject[]>([]);
//     const [expandedYear, setExpandedYear] = useState<number | null>(null);

//     // Initialize useNavigate hook
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchSubjects = async () => {
//             try {
//                 const fetchedSubjects = await getAllSubjectsByProgram(program?.id);
//                 setSubjects(fetchedSubjects);
//             } catch (error) {
//                 console.error("Error fetching subjects", error);
//             }
//         };

//         fetchSubjects();
//     }, [program?.id]);

//     const handleViewBooks = async (subjectId: number) => {
//         try {
//             const books = await getAllBookRefBySubject(subjectId);
//             setSelectedBooks(books);
//         } catch (error) {
//             console.error("Error fetching books for subject", error);
//             setSelectedBooks([]);
//         }
//     };

//     const filteredBooks = selectedBooks
//         ? selectedBooks.filter((book) =>
//             book.book_name.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//         : [];

//     const handleViewBookDetails = (bookId: number) => {
//         // Navigate to the BookDetails page with the book ID
//         navigate(`/user/book/${bookId}`, { state: { bookId } });
//     };

//     return (
//         <Box display="flex" flexDirection="column" minHeight="100vh">
//             <Sidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
//             <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
//                 <Header
//                     buttons={
//                         <IconButton onClick={() => setSidebarOpen(!isSidebarOpen)}>
//                             <MenuIcon style={{ color: "#EA4040" }} />
//                         </IconButton>
//                     }
//                 />
//                 <Typography
//                     variant="h4"
//                     gutterBottom
//                     sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
//                     fontWeight="bold"
//                 >
//                     {program ? `${program.name}` : "No Program Data"}
//                 </Typography>
//                 <Line />
//                 <Box display="flex" justifyContent="space-between">
//                     <Box width="100%" padding="0 1% 0 1%">
//                         {subjects && subjects.length > 0 ? (
//                             <Box>
//                                 {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yearLabel, yearIndex) => {
//                                     const yearSubjects = subjects.filter((subject) => subject.year === yearIndex + 1);

//                                     return (
//                                         <Box key={yearLabel} mb={2}>
//                                             <Box display="flex" justifyContent="space-between" alignItems="center">
//                                                 <Typography variant="h6" fontWeight="bold">
//                                                     {yearLabel}
//                                                 </Typography>
//                                                 {yearSubjects.length > 0 ? (
//                                                     <Button
//                                                         variant="text"
//                                                         size="small"
//                                                         onClick={() => setExpandedYear(expandedYear === yearIndex + 1 ? null : yearIndex + 1)}
//                                                         sx={{ color: "#EA4040", textTransform: "none" }}
//                                                     >
//                                                         {expandedYear === yearIndex + 1 ? "Hide Subjects" : "View Subjects"}
//                                                     </Button>
//                                                 ) : (
//                                                     <Typography variant="body2" color="textSecondary">
//                                                         No subjects available for this year
//                                                     </Typography>
//                                                 )}
//                                             </Box>
//                                             {expandedYear === yearIndex + 1 && yearSubjects.length > 0 && (
//                                                 <Box pl={2}>
//                                                     {yearSubjects.map((subject, index) => (
//                                                         <Box
//                                                             key={index}
//                                                             display="flex"
//                                                             justifyContent="space-between"
//                                                             alignItems="center"
//                                                             mb={1}
//                                                         >
//                                                             <Typography variant="body2">{subject.subject_name}</Typography>
//                                                             <Button
//                                                                 onClick={() => handleViewBooks(subject.id)}
//                                                                 sx={{ color: "#EA4040", textTransform: "none" }}
//                                                             >
//                                                                 View Books
//                                                             </Button>
//                                                         </Box>
//                                                     ))}
//                                                     <Divider />
//                                                 </Box>
//                                             )}
//                                         </Box>
//                                     );
//                                 })}
//                             </Box>
//                         ) : (
//                             <Typography variant="body2" color="textSecondary">
//                                 Curriculum data is not available for this program.
//                             </Typography>
//                         )}
//                     </Box>

//                     <Box height="65vh" width="60vw" padding="1rem" overflow="auto">
//                         <TextField
//                             label="Search Books"
//                             variant="outlined"
//                             fullWidth
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             sx={{ marginBottom: "1rem" }}
//                         />
//                         {selectedBooks ? (
//                             selectedBooks.length > 0 ? (
//                                 <Box>
//                                     <Typography variant="h6" fontWeight="bold" gutterBottom>
//                                         Book List
//                                     </Typography>
//                                     {filteredBooks?.map((book) => (
//                                         <Box
//                                             key={book.id}
//                                             display="flex"
//                                             flexDirection="column"
//                                             border="1px solid #ddd"
//                                             borderRadius="8px"
//                                             padding="1rem"
//                                             marginBottom="1rem"
//                                             boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
//                                         >
//                                             <Typography variant="subtitle1" fontWeight="bold">
//                                                 {book.book_name}
//                                             </Typography>
//                                             <Typography variant="body2" color="textSecondary">
//                                                 Subject: {book.subject_name}
//                                             </Typography>
//                                             <Typography variant="body2" color="textSecondary">
//                                                 Status: {book.status === 1 ? "Available" : "Unavailable"}
//                                             </Typography>
//                                             <Button
//                                                 variant="outlined"
//                                                 sx={{ marginTop: "0.5rem", textTransform: "none" }}
//                                                 onClick={() => handleViewBookDetails(book.id)} // Navigate to BookDetails page
//                                             >
//                                                 View Details
//                                             </Button>
//                                         </Box>
//                                     ))}
//                                 </Box>
//                             ) : (
//                                 <Typography variant="body2" color="textSecondary">
//                                     No books found for the selected subject.
//                                 </Typography>
//                             )
//                         ) : (
//                             <Typography variant="body2" color="textSecondary">
//                                 Select a subject to view the list of books.
//                             </Typography>
//                         )}
//                     </Box>
//                 </Box>
//             </Container>
//             <Copyright />
//         </Box>
//     );
// };

// export default ProgramPage;
