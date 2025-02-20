import { Box, Container, IconButton, Typography, Accordion, AccordionSummary, AccordionDetails, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import MenuIcon from "@mui/icons-material/Menu";
import Line from "../components/Line/Line";
import Copyright from "../components/Footer/Copyright";
import BookList from "../components/Book/BookList/BookListComponent";
import { getAllBooks } from "../services/Cataloging/LocalBooksAPI";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { Book } from "../model/Book";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchBar from "../components/SearchBar/Searchbar";
import { AccountBalanceWallet, AutoStories, HourglassBottom } from "@mui/icons-material";

const FilterAccordion: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls={`${title}-content`}
      id={`${title}-header`}
    >
      <Typography>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography>{content}</Typography>
    </AccordionDetails>
  </Accordion>
);

const CatalogHome: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [query] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Pagination states
  const [page, setPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBooks = async () => {
    try {
      const bookData = await getAllBooks();
      const mappedBookData = bookData.map((book: Book) => ({
        id: book.id,
        accessionNo: book.accessionNo,
        title: book.title,
        authors: book.authors || [],
        publisher: book.publisher,
        publishedDate: book.publishedDate,
        isbn10: book.isbn10,
        isbn13: book.isbn13,
        thumbnail: book.thumbnail || "default-thumbnail.jpg",
        description: book.description,
        language: book.language,
        categories: book.categories,
        pageCount: book.pageCount,
        printType: book.printType,
        status: book.status // Ensure status is included
      }));
      setBooks(mappedBookData);
      setTotalPages(Math.ceil(mappedBookData.length / booksPerPage));
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to fetch books from the database.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [booksPerPage]);

  // Check for refresh flag when navigating back from BookDetails
  useEffect(() => {
    if (location.state?.refresh) {
      fetchBooks();
      // Clear the refresh flag after fetching
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);



  const handleSearch = () => {
    console.log("Search for: ", query);
    setPage(1); // Reset to first page when searching
  };

  const handleBookClick = (book: Book) => {
    navigate(`/user/book/${book.id}`, {
      state: { book },
    });
  };

  const handleSideBarClick = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  // Get current books for pagination
  const getCurrentBooks = () => {
    const indexOfLastBook = page * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    return books.slice(indexOfFirstBook, indexOfLastBook);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Header
          buttons={
            <IconButton onClick={handleSideBarClick}>
              <MenuIcon style={{ color: "#EA4040" }} />
            </IconButton>
          }
        />
        <Box sx={{ paddingBottom: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" },
              marginBottom: 2,
            }}
            fontWeight="bold"
          >
            Browse Books
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Line />
          </Box>

          <SearchBar onSearch={handleSearch} />

          <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ marginTop: "30px" }}>
            <Box
              width="15vw"
              sx={{
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                padding: 2,
                overflow: "auto",
                marginTop: 0,
              }}
            >
              <FilterAccordion title="Subject" content="Science, Technology, Arts" />
              <FilterAccordion title="Section" content="Physics, Chemistry, Biology" />
              <FilterAccordion title="Collection" content="Books, Journals, Magazines" />
              <FilterAccordion title="Publication Year" content="2020 - 2025" />
              <FilterAccordion title="Language" content="English, Spanish" />
            </Box>

            <Box
              width="50vw"
              sx={{
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                marginX: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: 2,
                height: "90vh",
                position: "relative"
              }}
            >
              <Box sx={{
                overflowY: "auto",
                height: "calc(100% - 60px)"
              }}>
                <BookList books={getCurrentBooks()} onBookClick={handleBookClick} source="" />
              </Box>

              <Box sx={{
                // position: "sticky",
                // bottom: 0,
                backgroundColor: "white",
                paddingTop: 2,
                display: "flex",
                justifyContent: "center"
              }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Box>

            <Box
              maxWidth="20vw"
              sx={{
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                padding: 2,
                marginTop: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                Account Overview
              </Typography>

              <Box
                bgcolor="#CC0000"
                sx={{
                  width: "100%",
                  height: "1vh"
                }}
              />

              <SummaryBox
                icon={<AutoStories sx={{ fontSize: 40, color: "green" }} />}
                value={5}
                label="Checkouts"
                color="green"
              />
              <SummaryBox
                icon={<HourglassBottom sx={{ fontSize: 40, color: "orange" }} />}
                value={3}
                label="Holds Pending"
                color="orange"
              />
              <SummaryBox
                icon={<AccountBalanceWallet sx={{ fontSize: 40, color: "red" }} />}
                value={25}
                label="Fines and Charges (₱)"
                color="red"
              />
            </Box>
          </Box>
        </Box>

        {error && <Typography color="error">{error}</Typography>}
      </Container>

      <Box sx={{ marginTop: 4 }}>
        <Copyright />
      </Box>
    </Box>
  );
};

const SummaryBox: React.FC<{ icon: React.ReactNode; value: number; label: string; color: string }> = ({
  icon,
  value,
  label,
  color,
}) => (
  <Box
    sx={{
      flex: 1,
      backgroundColor: "#f9f9f9",
      padding: 2,
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {icon}
    <Typography
      variant="h4"
      fontWeight="bold"
      sx={{ fontSize: "2rem", marginBottom: 1, color }}
    >
      {value}
    </Typography>
    <Typography variant="h6">{label}</Typography>
  </Box>
);

export default CatalogHome;