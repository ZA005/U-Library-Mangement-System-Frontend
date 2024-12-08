import React, { useState } from "react";
import { Box, Container, IconButton, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import Copyright from "../../components/Footer/Copyright";
import AddNewSubjectModal from "../../components/AddNewSubjectModal";
import UpdateSubjectModal from "../../components/UpdateSubjectModal";

import styles from "./styles.module.css";

const ManageSubjects: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSideBarClick = () => {
    console.log("Hamburger menu clicked!");
  };

  // temporary datas just to visualize the style
  const departments = [
    { code: "BIT 2132K", name: "Introduction to Computing", department: "Computer Studies", courses: 4, status: "Active" },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateSubject = () => {

  }

  const handleAddSubject = () => {

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
          Manage Subjects
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
            Add New Subject
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
                <TableCell>COURSES</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((dept, index) => (
                <TableRow key={index}>
                  <TableCell>{dept.code}</TableCell>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.department}</TableCell>
                  <TableCell>{dept.courses}</TableCell>
                  <TableCell className={dept.status === "Active" ? styles.activeStatus : styles.inactiveStatus}>
                    {dept.status.toUpperCase()}
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
      <AddNewSubjectModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onSubjectAdd={handleAddSubject}
      />
      
      <UpdateSubjectModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onSubjectUpdate={ handleUpdateSubject }
      />
      <Copyright />
    </Box>
  );
};

export default ManageSubjects;
