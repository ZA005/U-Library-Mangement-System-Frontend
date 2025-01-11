import React, { useState } from 'react';
import Papa from 'papaparse';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Container, IconButton } from '@mui/material';
import styles from './styles.module.css';
import Header from '../../components/Header/Header';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../../components/Sidebar';
import Line from '../../components/Line/Line';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

interface Item {
    [key: string]: string;
}

interface RowData {
    [key: string]: Item;
}

const AcquiredItems: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>(''); // State to store file name
    const [array, setArray] = useState<Item[]>([]);
    const [data, setData] = useState<RowData>({}); // Store row data in a separate object
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSideBarClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name); // Update the file name state when file is selected
        }
    };

    const csvFileToArray = (csvString: string): void => {
        Papa.parse(csvString, {
            complete: (result) => {
                const parsedData = result.data as Item[]; // Access the parsed rows as Item[]
                setArray(parsedData);

                // Storing each row in the `data` object for separate access
                const rowData: RowData = {};
                parsedData.forEach((item, index) => {
                    rowData[`row-${index}`] = item;
                });
                setData(rowData); // Store each row data in the `data` object
            },
            header: true, // Automatically use the first row as headers
            skipEmptyLines: true, // Skip empty lines in the CSV
        });
    };

    const handleOnSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        if (file) {
            const fileReader = new FileReader();

            fileReader.onload = function (event) {
                const text = event.target?.result as string;
                csvFileToArray(text); // Parse CSV string
            };

            fileReader.readAsText(file);
        }
    };

    const headerKeys = Object.keys(Object.assign({}, ...array));

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
                    Accession Record
                </Typography>
                <Line />

                <Box className={styles.actionBar}>
                    <form onSubmit={handleOnSubmit}>
                        {/* Custom file input using <label> and <input> */}
                        <label htmlFor="btn-upload">
                            <input
                                id="btn-upload"
                                name="btn-upload"
                                type="file"
                                style={{ display: 'none' }} // Hide the default input
                                accept=".csv" // Only accept CSV files
                                onChange={handleOnChange} // Handle file selection
                            />
                            <Button
                                variant="outlined"
                                component="span"
                                className="btn-choose" // Optional class for styling
                            >
                                Choose File
                            </Button>
                        </label>

                        {/* Show file name next to the Choose File button */}
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
                                marginLeft: 2, // Add some margin to the "Import" button
                            }}
                            type="submit"
                        >
                            Import
                        </Button>
                    </form>
                </Box>

                <br />

                <TableContainer
                    component={Paper}
                    className={styles.tableContainer}
                    sx={{ maxHeight: "60vh", overflowY: "auto" }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {headerKeys.map((key) => (
                                    <TableCell key={key}><strong>{key}</strong></TableCell>
                                ))}
                                <TableCell><strong>ACTION</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {array.length > 0 ? (
                                array.map((item, index) => (
                                    <TableRow key={index}>
                                        {Object.values(item).map((val, idx) => (
                                            <TableCell key={idx}>{val}</TableCell>
                                        ))}
                                        <TableCell>
                                            <Box >
                                                <IconButton><SearchIcon className={styles.searchIcon} /></IconButton>
                                                <IconButton><AddIcon className={styles.addIcon} /></IconButton>
                                            </Box>


                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={headerKeys.length} align="center">
                                        <Typography variant="body1" sx={{ color: "gray" }}>
                                            No data available.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default AcquiredItems;
