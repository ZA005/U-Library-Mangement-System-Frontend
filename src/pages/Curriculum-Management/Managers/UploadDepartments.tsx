import React, { useState, useEffect } from "react";
import { Box, Container, IconButton, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { getAllDepartments, Department } from "../../../services/Curriculum/DepartmentService";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../components/Header/Header";
import Line from "../../../components/Line/Line";
import Copyright from "../../../components/Footer/Copyright";
import AddNewDepartmentModal from "../../../components/CurriculumManagement/AddNewDepartmentModal";
import UpdateDepartmentModal from "../../../components/CurriculumManagement/UpdateDepartmentModal";
import styles from "./styles.module.css";
import Sidebar from "../../../components/Sidebar";

const ModalType = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
};

const UploadDepartments: React.FC = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {

    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartments();
        console.log(data)
        setDepartments(data);
        setFilteredDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Sidebar toggle function
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Generic modal open/close handler
  const handleModalToggle = (type: string | null) => {
    setOpenModal(prev => (prev === type ? null : type));  // Toggle modal
  };

  const refreshList = async () => {
    try {
      const data = await getAllDepartments();
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const handleEditClick = (department: Department) => {
    setSelectedDepartment(department); // Set the selected program
    handleModalToggle(ModalType.UPDATE); // Open the modal
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter the departments based on the search term
    const filtered = departments.filter((dept) =>
      dept.name.toLowerCase().includes(term)
    );
    setFilteredDepartments(filtered);
  };

  return (
    <Box className={styles.rootContainer}>
      <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />
      <Container maxWidth="lg" className={styles.container}>
        <Header
          buttons={<IconButton onClick={toggleSidebar}>
            <MenuIcon className={styles.menuIcon} />
          </IconButton>}
        />
        <Typography variant="h4" gutterBottom className={styles.title}>Manage Departments</Typography>

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
            onClick={() => handleModalToggle(ModalType.ADD)}
          >
            Add New Department
          </Button>
          <Box className={styles.searchBox}>
            <TextField
              placeholder="Search..."
              size="small"
              value={searchTerm}
              onChange={handleSearchChange} // Bind search input to the state
              InputProps={{ startAdornment: <SearchIcon className={styles.searchIcon} /> }}
            />
            {/* <IconButton><TuneIcon className={styles.tuneIcon} /></IconButton> */}
          </Box>
        </Box>

        <TableContainer component={Paper} className={styles.tableContainer} sx={{ maxHeight: "60vh", overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>NAME</strong></TableCell>
                <TableCell><strong>STATUS</strong></TableCell>
                <TableCell><strong>ACTION</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>{dept.name}</TableCell>
                    <TableCell
                      sx={{
                        color: dept.status === 1 ? "green" : "red",
                      }}
                    >
                      <strong>{dept.status === 1 ? "ACTIVE" : "INACTIVE"}</strong>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        sx={{
                          color: "#EA4040",
                          textTransform: "none",
                          ":hover": { backgroundColor: "#f2f2f2", color: "#d13333" },
                        }}
                        onClick={() => handleEditClick(dept)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body1" sx={{ color: "gray" }}>
                      No departments match your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Add New Department Modal */}
      <AddNewDepartmentModal
        open={openModal === ModalType.ADD}
        handleClose={() => handleModalToggle(ModalType.ADD)}
        onDepartmentAdd={refreshList}
      />

      {/* Update Department Modal */}
      <UpdateDepartmentModal
        open={openModal === ModalType.UPDATE}
        handleClose={() => handleModalToggle(ModalType.UPDATE)}
        onDepartmentUpdated={refreshList}
        department={selectedDepartment}
      />

      <Copyright />
    </Box>
  );
};

export default UploadDepartments;
