import React, { useState, useEffect } from "react";
import { Box, Container, IconButton, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../components/Header/Header";
import Line from "../../../components/Line/Line";
import Copyright from "../../../components/Footer/Copyright";
import AddNewCourseModal from "../../../components/CurriculumManagement/AddNewProgramModal";
import UpdateCourseModal from "../../../components/CurriculumManagement/UpdateProgramModal";
import Sidebar from "../../../components/Sidebar";
import { getAllPrograms, Program } from "../../../services/Curriculum/ProgramService";
import styles from "./styles.module.css";

const ModalType = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
};

const ManageCourses: React.FC = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch programs on component mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getAllPrograms();
        setPrograms(data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  // Sidebar toggle function
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Generic modal open/close handler
  const handleModalToggle = (type: string | null) => {
    setOpenModal(prev => (prev === type ? null : type));  // Toggle modal
  };

  const refreshList = async () => {
    try {
      const data = await getAllPrograms(); // Re-fetch the programs
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const handleEditClick = (program: Program) => {
    setSelectedProgram(program); // Set the selected program
    handleModalToggle(ModalType.UPDATE); // Open the modal
  };

  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className={styles.rootContainer}>
      <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />
      <Container maxWidth="lg" className={styles.container}>
        <Header
          buttons={
            <IconButton onClick={toggleSidebar}>
              <MenuIcon className={styles.menuIcon} />
            </IconButton>
          }
        />
        <Typography variant="h4" gutterBottom className={styles.title}>
          Manage Program
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
            onClick={() => handleModalToggle(ModalType.ADD)}
          >
            Add New Program
          </Button>

          <Box className={styles.searchBox}>
            <TextField
              placeholder="Search..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon className={styles.searchIcon} />,
              }}
            />
          </Box>
        </Box>

        <TableContainer component={Paper} className={styles.tableContainer} sx={{ maxHeight: "60vh", overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>NAME</strong></TableCell>
                <TableCell><strong>DEPARTMENT</strong></TableCell>
                <TableCell><strong>STATUS</strong></TableCell>
                <TableCell><strong>ACTION</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>{program.name}</TableCell>
                    <TableCell>{program.department_name}</TableCell>
                    <TableCell
                      sx={{
                        color: program.status === 1 ? "green" : "red",
                      }}
                    >
                      <strong>{program.status === 1 ? "ACTIVE" : "INACTIVE"}</strong>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        sx={{
                          color: "#EA4040",
                          textTransform: "none",
                          ":hover": { backgroundColor: "#f2f2f2", color: "#d13333" },
                        }}
                        onClick={() => handleEditClick(program)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body1" sx={{ color: "gray" }}>
                      No programs match your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Add New Course Modal */}
      <AddNewCourseModal
        open={openModal === ModalType.ADD}
        handleClose={() => handleModalToggle(ModalType.ADD)}
        onProgramAdd={refreshList}
      />

      {/* Update Course Modal */}
      <UpdateCourseModal
        open={openModal === ModalType.UPDATE}
        handleClose={() => handleModalToggle(ModalType.UPDATE)}
        onProgramUpdate={refreshList}
        program={selectedProgram}
      />

      <Copyright />
    </Box>
  );
};

export default ManageCourses;
