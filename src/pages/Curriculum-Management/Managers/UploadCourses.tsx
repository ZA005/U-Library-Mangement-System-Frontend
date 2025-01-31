import React, { useState, useEffect } from "react";
import { Box, Container, IconButton, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../components/Header/Header";
import Line from "../../../components/Line/Line";
import Copyright from "../../../components/Footer/Copyright";
import AddNewSubjectModal from "../../../components/CurriculumManagement/AddNewSubjectModal";
import UpdateSubjectModal from "../../../components/CurriculumManagement/UpdateSubjectModal";
import Sidebar from "../../../components/Sidebar";
import { getAllSubjects, Subject } from "../../../services/Curriculum/SubjectService";
import styles from "./styles.module.css";

const ModalType = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
};

const ManageSubjects: React.FC = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getAllSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);


  // Sidebar toggle function
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const handleModalToggle = (type: string | null) => {
    setOpenModal(prev => (prev === type ? null : type));  // Toggle modal
  };

  const refreshList = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }

  const handleEditClick = (subject: Subject) => {
    setSelectedSubject(subject); // Set the selected program
    handleModalToggle(ModalType.UPDATE); // Open the modal
  };

  const convertYearToString = (year: number): string => {
    switch (year) {
      case 1:
        return "1st Year";
      case 2:
        return "2nd Year";
      case 3:
        return "3rd Year";
      case 4:
        return "4th Year";
      case 5:
        return "5th Year";
      default:
        return "Unknown Year";
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.program_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className={styles.rootContainer}>
      <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />
      <Container maxWidth="lg" className={styles.container}>
        <Header
          buttons={
            <>
              <IconButton onClick={toggleSidebar}>
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
            Add New Subject
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
                <TableCell>NAME</TableCell>
                <TableCell>PROGRAM</TableCell>
                <TableCell>YEAR</TableCell>
                <TableCell>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>{subject.subject_name}</TableCell>
                    <TableCell>{subject.program_name}</TableCell>
                    <TableCell>{convertYearToString(subject.year)}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        sx={{
                          color: "#EA4040",
                          textTransform: "none",
                          ":hover": { backgroundColor: "#f2f2f2", color: "#d13333" },
                        }}
                        onClick={() => handleEditClick(subject)}
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
                      No subjects match your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <AddNewSubjectModal
        open={openModal === ModalType.ADD}
        handleClose={() => handleModalToggle(ModalType.ADD)}
        onSubjectAdd={refreshList}
      />

      <UpdateSubjectModal
        open={openModal === ModalType.UPDATE}
        handleClose={() => handleModalToggle(ModalType.UPDATE)}
        onSubjectUpdate={refreshList}
        subject={selectedSubject}
      />
      <Copyright />
    </Box>
  );
};

export default ManageSubjects;
