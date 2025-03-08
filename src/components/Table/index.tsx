/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, Box, Typography, Pagination
} from "@mui/material";

interface Column {
    key: string;
    label: string;
    render?: (row: any) => React.ReactNode;
}

interface TableProps {
    columns: Column[];
    data: any[];
    loading: boolean;
    error?: string;
    page: number;
    itemsPerPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const DynamicTable: React.FC<TableProps> = ({ columns, data, loading, error, page, itemsPerPage, onPageChange }) => {
    const paginatedData = React.useMemo(() => {
        return data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    }, [data, page, itemsPerPage]);

    return (
        <Box>
            {loading && <CircularProgress />}
            {error && <Typography color="error">Failed to fetch records</Typography>}
            {!loading && !error && data.length === 0 && <Typography>No records found</Typography>}

            {!loading && !error && data.length > 0 && (
                <>
                    <TableContainer component={Paper} sx={{ height: '60vh', overflowY: 'auto' }}>
                        <Table>
                            <TableHead sx={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1 }}>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell key={col.key}><b>{col.label}</b></TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((row) => (
                                    <TableRow key={row.id}>
                                        {columns.map((col) => (
                                            <TableCell key={col.key}>
                                                {col.render ? col.render(row) : row[col.key]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={Math.ceil(data.length / itemsPerPage)}
                            page={page}
                            onChange={onPageChange}
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default DynamicTable;
