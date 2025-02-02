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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../../components/Header/Header";
import Line from "../../../../components/Line/Line";
import Copyright from "../../../../components/Footer/Copyright";
import Sidebar from "../../../../components/Sidebar";
import FileInstructionDialog from "./FileInstructionDialog";
import ConfirmUploadDialog from "./ConfirmUploadDialog";
import { useDepartments } from "../../../../hooks/useDepartments";
import { useProgramsByDepartment } from "../../../../hooks/usePrograms";
import { useCurriculumByProgram } from "../../../../hooks/useCurriculum";
import { useCsvUploader } from "./useUploadCurriculums";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { useDialog } from "../../../../hooks/useDialog";
import styles from "../styles.module.css";

const UploadCurriculum: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [openFileInstructionDialog, setOpenFileInstructionDialog] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const { snackbarOpen, snackbarMessage, snackbarStatus, openSnackbar, closeSnackbar } = useSnackbar();

    const [departmentId, setDepartmentId] = useState<string>("");
    const [departmentName, setDepartmentName] = useState<string>("");

    const [programId, setProgramId] = useState<number>();
    const [ProgramDescription, setProgramDescription] = useState<string>("");
    const [ProgramCode, setProgramCode] = useState<string>("");

    const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments(true);

    const { programs, loading: programsLoading, error: programsError } = useProgramsByDepartment(departmentId);

    const { curriculums, loading: curriculumsLoading, error: curriculumsError } = useCurriculumByProgram(programId);

    const { uploadCsv, isUploading, uploadError, parsedData } = useCsvUploader();
    const { isOpen, dialogContent, openDialog, closeDialog } = useDialog();

    const filteredCurriculum = curriculums.filter((prog) =>
        prog.curr_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
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

    // Handle department change to update departmentId and fetch corresponding programs
    const handleProgramChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as number;
        setProgramId(value);
        setSearchTerm("");

        const selectedProgram = programs.find((prog) => prog.prog_id === value);
        if (selectedProgram) {
            console.log(selectedProgram.prog_id);
            setProgramDescription(selectedProgram.description);
            setProgramCode(selectedProgram.code); // Assuming there's a 'code' field in the program object
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setFileToUpload(file);
            openDialog("Confirm CSV Import", "Are you sure you want to import this CSV file? This action cannot be undone.", "Upload", "Cancel");
            (e.target as HTMLInputElement).value = '';
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
        }
    }, [uploadError, parsedData, openSnackbar]);

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
                    Upload Curriculums
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
                        {isUploading ? "Uploading..." : "Upload Curriculums"}
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

                        <Select
                            value={programId || ''}  // Ensure it's the programId and not ProgramDescription
                            onChange={handleProgramChange}
                            displayEmpty
                            size="small"
                            sx={{ width: 300, marginRight: 2 }}
                        >
                            <MenuItem value="" disabled>
                                Select Program
                            </MenuItem>
                            {programs.map((program) => (
                                <MenuItem key={program.prog_id} value={program.prog_id}>
                                    {program.description}
                                </MenuItem>
                            ))}
                        </Select>

                        <TextField
                            placeholder="Search by ID..."
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
                        Please select a department and program to view its curriculums.
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
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>PROGRAM</strong></TableCell>
                                    <TableCell><strong>REVISION NO</strong></TableCell>
                                    <TableCell><strong>EFFECTIVITY SEMESTER</strong></TableCell>
                                    <TableCell><strong>EFFECTIVITY SY</strong></TableCell>
                                    {/* <TableCell><strong>PROGRAM NAME</strong></TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCurriculum.length > 0 ? (
                                    filteredCurriculum.map((curr) => (
                                        <TableRow key={curr.curr_id}>
                                            <TableCell width="10%">{curr.curr_id}</TableCell>
                                            <TableCell width="10%">{curr.program_code}</TableCell>
                                            <TableCell width="10%">{curr.revision_no}</TableCell>
                                            <TableCell width="10%">{curr.effectivity_sem}</TableCell>
                                            <TableCell width="10%">{curr.effectivity_sy}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            <Typography variant="body1" sx={{ color: "gray" }}>
                                                No programs under {ProgramDescription}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
}

export default UploadCurriculum;