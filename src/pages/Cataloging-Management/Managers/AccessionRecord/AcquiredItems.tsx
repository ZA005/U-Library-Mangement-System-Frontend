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

const AcquiredItems: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [array, setArray] = useState<Item[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const savedArray = localStorage.getItem('csvData');
        const savedFileName = localStorage.getItem('csvFileName');

        if (savedArray) {
            setArray(JSON.parse(savedArray));
        }
        if (savedFileName) {
            setFileName(savedFileName);
        }
    }, []);

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
                localStorage.setItem('csvData', JSON.stringify(parsedData));
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
                localStorage.setItem('csvFileName', fileName);
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
                <TableContainer
                    component={Paper}
                    className={styles.tableContainer}
                    sx={{ maxHeight: '60vh', overflowY: 'auto' }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {headerKeys.map((key) => (
                                    <TableCell key={key}>
                                        <strong>{key}</strong>
                                    </TableCell>
                                ))}
                                <TableCell></TableCell>
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
                                            <Select
                                                value={selectedOption}
                                                onChange={(e) => handleSelectChange(e.target.value, item)}
                                                displayEmpty
                                                className={styles.select}
                                            >
                                                <MenuItem value="" disabled>
                                                    Action
                                                </MenuItem>
                                                <MenuItem value="searchGoogleBooks">Search Google Books</MenuItem>
                                                <MenuItem value="addToCatalog">Add to Catalog</MenuItem>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={headerKeys.length + 1} align="center">
                                        <Typography variant="body1" sx={{ color: 'gray' }}>
                                            No data available.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Copyright />
        </Box>
    );
};

export default AcquiredItems;
