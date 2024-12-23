import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Container, Typography, Icon } from "@mui/material";
import Header from "../../components/Header/Header";
import Copyright from "../../components/Footer/Copyright";
import MenuIcon from "@mui/icons-material/Menu";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BookIcon from "@mui/icons-material/Book";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Line from "../../components/Line/Line";
import styles from "./styles.module.css";
import Sidebar from "../../components/Sidebar";

const CurriculumManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Header
          buttons={
            <>
              <IconButton onClick={handleSideBarClick}>
                <MenuIcon style={{ color: "#EA4040" }} />
              </IconButton>
            </>
          }
        />

        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
          fontWeight="bold"
        >
          Curriculum Management
        </Typography>
        <Line />

        <Box className={styles.container}>
          {/* Left Content */}
          <Box className={styles.leftContent}>
            <Typography variant="body1">
              This is your all-in-one tool designed to simplify how you manage
              and organize your library's academic curriculum. Whether you're an
              administrator, librarian, or faculty member, this interface is
              here to help you stay on top of everything.
            </Typography>

            <Typography variant="body1">
              With just a few clicks, you can:
            </Typography>
            <ul>
              <li className={styles.listItem}>
                <Typography variant="body1">
                  <strong>Manage Departments:</strong> Keep track of all
                  departments and ensure their resources are well-structured and
                  easy to find.
                </Typography>
              </li>
              <li className={styles.listItem}>
                <Typography variant="body1">
                  <strong>Manage Courses:</strong> Organize courses, link them
                  to the right materials, and ensure students have everything
                  they need.
                </Typography>
              </li>
              <li className={styles.listItem}>
                <Typography variant="body1">
                  <strong>Manage Subjects:</strong> Align subjects with the
                  curriculum and make sure every topic is covered with the right
                  resources.
                </Typography>
              </li>
              <li className={styles.listItem}>
                <Typography variant="body1">
                  <strong>Manage Book Reference:</strong> Build and maintain a
                  complete catalog of books and references to support teaching
                  and learning.
                </Typography>
              </li>
            </ul>
          </Box>

          {/* Right Content */}
          <Box className={styles.rightContent}>
            <Box className={styles.buttonContainer}>
              <Icon className={styles.icon}>
                <LocationCityIcon />
              </Icon>
              <button
                className={styles.manageButton}
                onClick={ () => navigate('/curriculum/management/manage/departments') }
              >
                Manage Departments
              </button>
            </Box>

            <Box className={styles.buttonContainer}>
              <Icon className={styles.icon}>
                <LocalLibraryIcon />
              </Icon>
              <button
                className={styles.manageButton}
                onClick={ () => navigate('/curriculum/management/manage/courses') }
              >Manage Courses</button>
            </Box>

            <Box className={styles.buttonContainer}>
              <Icon className={styles.icon}>
                <BookIcon />
              </Icon>
              <button
                className={styles.manageButton}
                onClick={ () => navigate('/curriculum/management/manage/subjects') }
              >Manage Subjects</button>
            </Box>

            <Box className={styles.buttonContainer}>
              <Icon className={styles.icon}>
                <AutoStoriesIcon />
              </Icon>
              <button className={styles.manageButton}>
                Manage Book Reference
              </button>
            </Box>
          </Box>
        </Box>
      </Container>
      <Copyright />
    </Box>
  );
};

export default CurriculumManagement;
