/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem } from '@mui/material';
import { Book } from '../../../../model/Book';
import { useNavigate } from 'react-router-dom';


interface WeedingDashboardProps {
    books: Book[];
    onWeedBook: (bookId: string) => void;
    onOverrideWeeding: (bookId: string, reason?: string) => void;
    onFilterChange: (filter: { ddc?: string, age?: number, condition?: string }) => void;
}

const dummyBooks: any = [
    {
        id: '1',
        title: 'Introduction to Philosophy',
        author: 'John Doe',
        ddc: '100',
        publicationYear: 2005,
        condition: 'good',
        isbn: '978-3-16-148410-0',
        language: 'English',
        usageFrequency: 10,
        lastUsedDate: '2023-05-15'
    },
    {
        id: '2',
        title: 'The History of Economics',
        author: 'Jane Smith',
        ddc: '330',
        publicationYear: 1998,
        condition: 'poor',
        isbn: '978-0-596-52068-7',
        language: 'English',
        usageFrequency: 3,
        lastUsedDate: '2022-12-01'
    },
    {
        id: '3',
        title: 'Quantum Physics for Beginners',
        author: 'Alex Johnson',
        ddc: '530',
        publicationYear: 2015,
        condition: 'excellent',
        isbn: '978-1-4919-5029-6',
        language: 'English',
        usageFrequency: 25,
        lastUsedDate: '2024-01-01'
    },
    {
        id: '4',
        title: 'Basic Home Gardening',
        author: 'Emily Green',
        ddc: '635',
        publicationYear: 2010,
        condition: 'fair',
        isbn: '978-1-56691-962-8',
        language: 'English',
        usageFrequency: 8,
        lastUsedDate: '2023-03-20'
    },
    {
        id: '5',
        title: 'The Art of Painting',
        author: 'Michael Art',
        ddc: '751',
        publicationYear: 1980,
        condition: 'fair',
        isbn: '978-0-394-55340-3',
        language: 'English',
        usageFrequency: 1,
        lastUsedDate: '2021-10-11'
    },
    {
        id: '6',
        title: 'Shakespeare\'s Complete Works',
        author: 'William Shakespeare',
        ddc: '822',
        publicationYear: 1960,
        condition: 'good',
        isbn: '978-1-85326-733-2',
        language: 'English',
        usageFrequency: 15,
        lastUsedDate: '2023-11-05'
    },
    {
        id: '7',
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        ddc: '909',
        publicationYear: 1988,
        condition: 'good',
        isbn: '978-0-553-38016-3',
        language: 'English',
        usageFrequency: 30,
        lastUsedDate: '2024-01-10'
    },
    {
        id: '8',
        title: 'Local Legends of Manila',
        author: 'Maria Lopez',
        ddc: '995',
        publicationYear: 2012,
        condition: 'excellent',
        isbn: '978-971-23-4567-8',
        language: 'English',
        usageFrequency: 5,
        lastUsedDate: '2023-08-22'
    },
    {
        id: '9',
        title: 'Encyclopedia Britannica',
        author: 'Various Authors',
        ddc: '030',
        publicationYear: 2000,
        condition: 'poor',
        isbn: '978-1-59339-292-5',
        language: 'English',
        usageFrequency: 2,
        lastUsedDate: '2022-04-15'
    },
    {
        id: '10',
        title: 'The Joy of Cooking',
        author: 'Irma S. Rombauer',
        ddc: '641',
        publicationYear: 1931,
        condition: 'fair',
        isbn: '978-0-7432-4626-2',
        language: 'English',
        usageFrequency: 40,
        lastUsedDate: '2023-12-30'
    }
];

// Make sure your Book type includes all these fields or adjust accordingly

const WeedingDashboard: React.FC<WeedingDashboardProps> = ({ books, onWeedBook, onOverrideWeeding, onFilterChange }) => {
    const [filter, setFilter] = useState<{ ddc?: string, age?: number, condition?: string }>({});

    const navigate = useNavigate();

    // useEffect(() => {
    //     onFilterChange(filter);
    // }, [filter, onFilterChange]);

    const handleFilterChange = (field: keyof typeof filter, value: string | number) => {
        setFilter(prev => ({ ...prev, [field]: value }));
    };



    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Book Weeding Dashboard</Typography>


            <Button
                variant="text"
                sx={{
                    color: "#EA4040",
                    textTransform: "none",
                    ":hover": {
                        backgroundColor: "#f2f2f2",
                        color: "#d13333",
                    },
                }}
                onClick={() => navigate('/admin/catalog/management/criteria')}
            >
                View Criteria
            </Button>
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Dewey Decimal"
                    value={filter.ddc || ''}
                    onChange={(e) => handleFilterChange('ddc', e.target.value)}
                    variant="outlined"
                />
                <TextField
                    type="number"
                    label="Age (Years)"
                    value={filter.age || ''}
                    onChange={(e) => handleFilterChange('age', Number(e.target.value))}
                    variant="outlined"
                />
                <Select
                    value={filter.condition || ''}
                    onChange={(e) => handleFilterChange('condition', e.target.value as string)}
                    displayEmpty
                    variant="outlined"
                >
                    <MenuItem value="">All Conditions</MenuItem>
                    <MenuItem value="poor">Poor</MenuItem>
                    <MenuItem value="fair">Fair</MenuItem>
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="excellent">Excellent</MenuItem>
                </Select>
            </Box>

            {/* Book Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="book weeding table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Dewey Decimal</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Condition</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dummyBooks.map((book: any) => (
                            <TableRow key={book.id}>
                                <TableCell component="th" scope="row">
                                    {book.title}
                                </TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.ddc}</TableCell>
                                <TableCell>{new Date().getFullYear() - Number(book.publicationYear)}</TableCell>
                                <TableCell>{book.condition}</TableCell>
                                <TableCell>
                                    <Button onClick={() => onWeedBook(book.id)} color="error" variant="contained" size="small">Weed</Button>
                                    <Button onClick={() => onOverrideWeeding(book.id)} variant="outlined" size="small" sx={{ ml: 1 }}>Override</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


        </Box>
    );
};

export default WeedingDashboard;