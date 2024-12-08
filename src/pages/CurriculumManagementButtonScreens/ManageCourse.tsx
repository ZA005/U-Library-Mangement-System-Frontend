import React, { useState } from "react";
import { Box, Container, IconButton, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import Copyright from "../../components/Footer/Copyright";
import AddNewCourseModal from "../../components/AddNewCourseModal";
import UpdateCourseModal from "../../components/UpdateCourseModal";

import styles from "./styles.module.css";

const ManageCourses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSideBarClick = () => {
    console.log("Hamburger menu clicked!");
  };

  // temporary datas just to visualize the style
  const courses = [
    { code: "IT", name: "Information Technology", department: "Computer Studies", subjects: 4, status: "Active" },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

    const handleUpdateCourse = () => {

  }

  const handleAddCourse = () => {

  }


  return (
    <Box className={styles.rootContainer}>
      <Container maxWidth="lg" className={styles.container}>
        <Header
          buttons={
            <>
              <IconButton onClick={handleSideBarClick}>
                <MenuIcon className={styles.menuIcon} />
              </IconButton>
            </>
          }
        />
        <Typography
          variant="h4"
          gutterBottom
          className={styles.title}
        >
          Manage Courses
        </Typography>
    
        <Line/>

        <Box className={styles.actionBar}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#EA4040",
              color: "#fff",
              textTransform: "none",
              ":hover": { backgroundColor: "#d13333" },
            }}
            onClick={handleOpenModal}
          >
            Add New Course
          </Button>

          <Box className={styles.searchBox}>
            <TextField
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: (
                  <SearchIcon className={styles.searchIcon} />
                ),
              }}
            />
            <IconButton>
              <TuneIcon className={styles.tuneIcon} />
            </IconButton>
          </Box>
        </Box>

        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>CODE</TableCell>
                <TableCell>NAME</TableCell>
                <TableCell>DEPARTMENT</TableCell>
                <TableCell># SUBJECTS</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.subjects}</TableCell>
                  <TableCell className={course.status === "Active" ? styles.activeStatus : styles.inactiveStatus}>
                    {course.status.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      sx={{
                        color: "#EA4040",
                        textTransform: "none",
                        ":hover": { backgroundColor: "#f2f2f2", color: "#d13333" },
                      }}
                      onClick={handleOpenModal} // Define this function to handle the button click event
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <AddNewCourseModal
        open = { isModalOpen}
        handleClose={handleCloseModal}
        onCourseAdd={handleAddCourse}
      />

      <UpdateCourseModal
        open = { isModalOpen}
        handleClose={handleCloseModal}
        onCourseUpdate={handleUpdateCourse}
      />
      <Copyright />
    </Box>
  );
};

export default ManageCourses;
