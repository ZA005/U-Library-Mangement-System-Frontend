import React, { useState } from "react";
import { Box, Container, IconButton, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Header from "../../../components/Header/Header";
import Line from "../../../components/Line/Line";
import Copyright from "../../../components/Footer/Copyright";
import AddNewDepartmentModal from "../../../components/CurriculumManagement/AddNewDepartmentModal";
import UpdateDepartmentModal from "../../../components/CurriculumManagement/UpdateDepartmentModal";
import styles from "./styles.module.css";
import Sidebar from "../../../components/Sidebar";

const ManageDepartments: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // temporary datas just to visualize the style
  const [departments, setDepartments] = useState([
    { code: "AS", name: "Arts and Sciences", courses: 4, status: "Active" },
  ]);


  const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateDepartment = () => {

  }

  const handleAddDepartment = (newDepartment: {
    code: string;
    name: string;
    status: string;
  }) => {
    setDepartments((prev) => [
      ...prev,
      { ...newDepartment, courses: 0 }, // Add new department with 0 courses initially
    ]);
  };

  return (
    <Box className={styles.rootContainer}>
      <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
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
        <Typography variant="h4" gutterBottom className={styles.title}>
          Manage Departments
        </Typography>

        <Line />

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
            Add New Department
          </Button>

          <Box className={styles.searchBox}>
            <TextField
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: <SearchIcon className={styles.searchIcon} />,
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
                <TableCell># COURSES</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((dept, index) => (
                <TableRow key={index}>
                  <TableCell>{dept.code}</TableCell>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.courses}</TableCell>
                  <TableCell
                    className={
                      dept.status === "Active"
                        ? styles.activeStatus
                        : styles.inactiveStatus
                    }
                  >
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

      {/* Call the AddNewDepartmentModal */}
      <AddNewDepartmentModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onDepartmentAdd={handleAddDepartment}
      />
      
      <UpdateDepartmentModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onDepartmentUpdate={ handleUpdateDepartment }
      />
      <Copyright />
    </Box>
  );
};

export default ManageDepartments;
