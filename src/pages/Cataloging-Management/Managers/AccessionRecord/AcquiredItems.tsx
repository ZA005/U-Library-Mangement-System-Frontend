import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Container,
    IconButton,
    Select,
    MenuItem,
} from '@mui/material';
import styles from './styles.module.css';
import Header from '../../../../components/Header/Header';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../../../../components/Sidebar';
import Line from '../../../../components/Line/Line';
import { useNavigate } from 'react-router-dom';
import Copyright from '../../../../components/Footer/Copyright';

interface Item {
    [key: string]: string;
}

interface FileData {
    name: string;
    uploadDate: string;
    data: Item[];
    isVisible: boolean;  // New property to track visibility of the table
}

const AcquiredItems: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [array, setArray] = useState<Item[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

    const navigate = useNavigate();

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    const handleSelectChange = (value: string, item: Item) => {
        setSelectedOption(value);
        if (value === 'searchGoogleBooks') {
            navigate('/admin/catalog/management/search-title', {
                state: { query: item.Title, books: item, source: 'Google Books' },
            });
        } else if (value === 'addToCatalog') {
            navigate('/admin/catalog/management/marc-record/add', { state: { item } });
        }
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const csvFileToArray = (csvString: string): void => {
        Papa.parse(csvString, {
            complete: (result) => {
                const parsedData = result.data as Item[];
                setArray(parsedData);

                const currentDate = new Date().toLocaleString();
                const newFileData: FileData = {
                    name: fileName,
                    uploadDate: currentDate,
                    data: parsedData,
                    isVisible: true,  // Initially the table is visible
                };

                // Save new file data to localStorage
                const existingFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
                existingFiles.push(newFileData);
                localStorage.setItem('uploadedFiles', JSON.stringify(existingFiles));

                // Update state with newly uploaded file
                setUploadedFiles(existingFiles);
            },
            header: true,
            skipEmptyLines: true,
        });
    };

    const handleOnSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        if (file) {
            const fileReader = new FileReader();

            fileReader.onload = function (event) {
                const text = event.target?.result as string;
                csvFileToArray(text);
            };

            fileReader.readAsText(file);
        }
    };

    // Retrieve uploaded files from localStorage on page load
    useEffect(() => {
        const storedFiles = localStorage.getItem('uploadedFiles');
        if (storedFiles) {
            setUploadedFiles(JSON.parse(storedFiles));
        }
    }, []);

    // Function to toggle visibility of the table
    const handleCloseTable = (index: number) => {
        const updatedFiles = [...uploadedFiles];
        updatedFiles[index].isVisible = false;
        setUploadedFiles(updatedFiles);

        // Update in localStorage to persist the change
        localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    };

    return (
        <Box className={styles.rootContainer}>
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" className={styles.container}>
                <Header
                    buttons={
                        <IconButton onClick={handleSideBarClick}>
                            <MenuIcon className={styles.menuIcon} />
                        </IconButton>
                    }
                />
                <Typography variant="h4" gutterBottom className={styles.title}>
                    Accession
                </Typography>
                <Line />
                <Box className={styles.actionBar}>
                    <form onSubmit={handleOnSubmit}>
                        <label htmlFor="btn-upload">
                            <input
                                id="btn-upload"
                                name="btn-upload"
                                type="file"
                                style={{ display: 'none' }}
                                accept=".csv"
                                onChange={handleOnChange}
                            />
                            <Button variant="outlined" component="span" className="btn-choose">
                                Choose File
                            </Button>
                        </label>
                        {fileName && (
                            <Typography variant="body1" sx={{ marginLeft: 2 }}>
                                {fileName}
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#EA4040',
                                color: '#fff',
                                textTransform: 'none',
                                ':hover': { backgroundColor: '#d13333' },
                                marginLeft: 2,
                            }}
                            type="submit"
                        >
                            Import
                        </Button>
                    </form>
                </Box>
                <br />
                {uploadedFiles.map((uploadedFile, index) => (
                    <div key={index}>
                        {uploadedFile.isVisible && (
                            <div>
                                <Typography variant="h6" gutterBottom>
                                    {uploadedFile.name} (Uploaded on: {uploadedFile.uploadDate})
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleCloseTable(index)}
                                        sx={{ marginLeft: 2 }}
                                    >
                                        Close
                                    </Button>
                                </Typography>
                                <TableContainer
                                    component={Paper}
                                    className={styles.tableContainer}
                                    sx={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: 2 }}
                                >
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {Object.keys(uploadedFile.data[0] || {}).map((key) => (
                                                    <TableCell key={key}>
                                                        <strong>{key}</strong>
                                                    </TableCell>
                                                ))}
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {uploadedFile.data.length > 0 ? (
                                                uploadedFile.data.map((item, rowIndex) => (
                                                    <TableRow key={rowIndex}>
                                                        {Object.values(item).map((val, idx) => (
                                                            <TableCell key={idx}>{val}</TableCell>
                                                        ))}
                                                        <TableCell>
                                                            <Select
                                                                value={selectedOption}
                                                                onChange={(e) => handleSelectChange(e.target.value, item)}
                                                                displayEmpty
                                                                className={styles.select}
                                                            >
                                                                <MenuItem value="" disabled>
                                                                    Action
                                                                </MenuItem>
                                                                <MenuItem value="searchGoogleBooks">
                                                                    Search Google Books
                                                                </MenuItem>
                                                                <MenuItem value="addToCatalog">Add to Catalog</MenuItem>
                                                            </Select>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={Object.keys(uploadedFile.data[0] || {}).length + 1} align="center">
                                                        <Typography variant="body1" sx={{ color: 'gray' }}>
                                                            No data available.
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )}
                    </div>
                ))}
            </Container>
            <Copyright />
        </Box>
    );
};

export default AcquiredItems;
