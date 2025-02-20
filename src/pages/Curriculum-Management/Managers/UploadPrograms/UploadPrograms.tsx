import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  IconButton,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Input,
  Select,
  MenuItem,
  CircularProgress
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../../components/Header/Header";
import Line from "../../../../components/Line/Line";
import Copyright from "../../../../components/Footer/Copyright";
import Sidebar from "../../../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useProgramsByDepartment } from "../../../../hooks/usePrograms";
import { useDepartments } from "../../../../hooks/useDepartments";
import { useCsvUploader } from "../UploadPrograms/useUploadPrograms";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { useDialog } from "../../../../hooks/useDialog";
import FileInstructionDialog from "./FileInstructionDialog";
import ConfirmUploadDialog from "./ConfirmUploadDialog";
import styles from "../styles.module.css";

const UploadPrograms: React.FC = () => {
  const navigate = useNavigate()
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [openFileInstructionDialog, setOpenFileInstructionDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [departmentId, setDepartmentId] = useState<string>("");
  const [departmentName, setDepartmentName] = useState<string>("");
  // Fetch programs based on the selected department
  const { programs, loading: programsLoading, error: programsError } = useProgramsByDepartment(departmentId);
  const { uploadCsv, isUploading, uploadError, parsedData } = useCsvUploader();

  // Use the custom snackbar hook
  const { snackbarOpen, snackbarMessage, snackbarStatus, openSnackbar, closeSnackbar } = useSnackbar();

  // Use the custom dialog hook
  const { isOpen, dialogContent, openDialog, closeDialog } = useDialog();

  // Fetch departments
  const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments(true);

  const filteredPrograms = programs.filter((prog) =>
    prog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFileToUpload(file);
      openDialog("Confirm CSV Import", "Are you sure you want to import this CSV file? This action cannot be undone.", "Upload", "Cancel");
      (e.target as HTMLInputElement).value = '';
    }
  };

  // Handle department change to update departmentId and fetch corresponding programs
  const handleDepartmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setDepartmentId(value);
    setDepartmentName(value);
    // Reset search term when changing department to ensure list update
    setSearchTerm("");

    const selectedDepartment = departments.find((dept) => dept.id === value);
    if (selectedDepartment) {
      setDepartmentName(selectedDepartment.name);
    }
  };

  const handleConfirmUpload = () => {
    if (fileToUpload) {
      uploadCsv(fileToUpload);
    }
    closeDialog();
  };

  const handleCancelUpload = () => {
    closeDialog();
    setFileToUpload(null);
  };

  const handleOpenFileExplorer = () => {
    const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  useEffect(() => {
    if (uploadError) {
      openSnackbar(uploadError, "error");
    } else if (parsedData) {
      openSnackbar("Programs uploaded successfully!", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [uploadError, parsedData, openSnackbar]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (!departmentsLoading && departments.length === 0) {
        navigate("/admin/curriculum/management/no-department");
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [departmentsLoading, departments, navigate]);

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
          Upload Programs
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
            onClick={() => setOpenFileInstructionDialog(true)}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Programs"}
          </Button>
          <Box className={styles.searchBox}>
            <Select
              value={departmentId}
              onChange={handleDepartmentChange}
              displayEmpty
              size="small"
              sx={{ width: 300, marginRight: 2 }}
            >
              <MenuItem value="" disabled>
                Select Department
              </MenuItem>
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              placeholder="Search..."
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{ startAdornment: <SearchIcon className={styles.searchIcon} /> }}
            />
          </Box>
        </Box>

        {programsLoading ? (
          <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
            Loading programs...
          </Typography>
        ) : programsError ? (
          <Typography variant="body1" sx={{ textAlign: "center", color: "gray", marginTop: 2 }}>
            Please select a department to view its programs.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            className={styles.tableContainer}
            sx={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>CODE</strong></TableCell>
                  <TableCell><strong>PROGRAM NAME</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((prog) => (
                    <TableRow key={prog.prog_id}>
                      <TableCell width="10%">{prog.code}</TableCell>
                      <TableCell width="70%">{prog.description}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body1" sx={{ color: "gray" }}>
                        No programs under {departmentName}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {loading && (
          <Box sx={{ textAlign: "center", marginTop: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbarStatus}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <FileInstructionDialog
        open={openFileInstructionDialog}
        onClose={() => setOpenFileInstructionDialog(false)}
        onProceed={() => {
          setOpenFileInstructionDialog(false);
          handleOpenFileExplorer();
        }}
      />

      <ConfirmUploadDialog
        open={isOpen}
        title={dialogContent.title}
        content={dialogContent.content}
        confirmText={dialogContent.confirmText}
        cancelText={dialogContent.cancelText}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelUpload}
      />

      {/* Hidden file input */}
      <Input
        type="file"
        inputProps={{ accept: ".csv" }}
        id="csv-upload"
        sx={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Copyright />
    </Box>
  );
};

export default UploadPrograms;
