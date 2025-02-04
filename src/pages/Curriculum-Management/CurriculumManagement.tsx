import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Container, Typography, Icon } from "@mui/material";
import Header from "../../components/Header/Header";
import Copyright from "../../components/Footer/Copyright";
import MenuIcon from "@mui/icons-material/Menu";
import LocationCityIcon from "@mui/icons-material/LocationCity";
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
          <Box className={styles.leftContent} sx={{ textAlign: "justify" }}>
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
                  <strong>Upload Curriculum:</strong> Allows you to easily import and manage the university's curriculum by uploading a CSV file. This enables the bulk import of course information, department details, and program structures, ensuring all curriculum data is accurately updated and organized within the system.
                </Typography>
              </li>
              <li className={styles.listItem}>
                <Typography variant="body1">
                  <strong>Manage Book Reference:</strong> Allows you to select and assign books as references for specific subjects, ensuring that the curriculum is aligned with appropriate reading materials. This helps maintain consistency and relevance in course content, supporting effective teaching and learning.
                </Typography>
              </li>
            </ul>

          </Box>

          {/* Right Content */}
          <Box className={styles.rightContent}>
            <Box className={styles.buttonContainer}>
              <Icon className={styles.icon} fontSize="large">
                <LocationCityIcon />
              </Icon>
              <button
                className={styles.manageButton}
                onClick={() => navigate('/admin/curriculum/management/upload-manager')}
              >
                Upload Manager
              </button>
            </Box>

            <Box className={styles.buttonContainer}>
              <Icon className={styles.icon} fontSize="large">
                <AutoStoriesIcon />
              </Icon>
              <button
                className={styles.manageButton}
                onClick={() => navigate('/admin/curriculum/management/reference')}
              >
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
