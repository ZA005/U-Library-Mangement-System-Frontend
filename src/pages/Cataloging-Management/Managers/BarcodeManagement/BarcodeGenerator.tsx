import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { useReactToPrint } from 'react-to-print';
import { Autocomplete, Box, CircularProgress, Container, IconButton, TextField, Typography, Button } from '@mui/material';
import styles from './styles.module.css';
import Sidebar from '../../../../components/Sidebar';
import Header from '../../../../components/Header/Header';
import MenuIcon from '@mui/icons-material/Menu';
import { getAllAccessionNo } from '../../../../services/Cataloging/LocalBooksAPI';
import Copyright from '../../../../components/Footer/Copyright';
import Line from '../../../../components/Line/Line';
import { BarcodeLabels } from '../../../../model/Book';

const BarcodeGenerator: React.FC = () => {
    const [selectedAccessions, setSelectedAccessions] = useState<BarcodeLabels[]>([]);
    const [options, setOptions] = useState<BarcodeLabels[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [startingPosition, setStartingPosition] = useState<number>(0);

    // Fetch accession numbers
    const handleOpen = async () => {
        setOpen(true);
        setLoading(true);
        try {
            const accessionNumbers = await getAllAccessionNo();
            setOptions(accessionNumbers);
        } catch (error) {
            console.error('Failed to fetch accession numbers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => setOpen(false);
    const handleSideBarClick = () => setSidebarOpen(!isSidebarOpen);
    const handleSidebarClose = () => setSidebarOpen(false);

    useEffect(() => {
        const generateBarcodes = (idPrefix: string) => {
            selectedAccessions.forEach((barcode, index) => {
                const svgElement = document.getElementById(`${idPrefix}barcode-${index}`);
                if (svgElement) {
                    JsBarcode(svgElement, barcode.accessionNo, {
                        format: "CODE128",
                        displayValue: true,
                        width: 1.5,
                        height: idPrefix === 'print-' ? 50 : 25, // 49mm for print, 25 for preview
                        fontSize: 20,
                        margin: 0,
                        background: "#FFF",
                        lineColor: "#000"
                    });
                }
            });
        };

        generateBarcodes(''); // For preview
        generateBarcodes('print-'); // For print layout

    }, [selectedAccessions]);

    const handleSelectionChange = (_event: React.SyntheticEvent, newValues: (string | BarcodeLabels)[]) => {
        // Check if "Select All" is in the newValues
        if (newValues.some(value => typeof value === 'string' && value === 'Select All')) {
            setSelectedAccessions(options);
        } else {
            setSelectedAccessions(newValues.filter((value): value is BarcodeLabels => typeof value !== 'string'));
        }
    };

    const handlePrint = useReactToPrint({ contentRef });

    return (
        <Box className={styles.rootContainer}>
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
            <Container maxWidth="lg" className={styles.container}>
                <Header buttons={<IconButton onClick={handleSideBarClick}><MenuIcon style={{ color: "#EA4040" }} /></IconButton>} />
                <Typography variant="h4" gutterBottom>Barcodes</Typography>
                <Line />
                <Container className={styles.containerBody}>
                    <Container className={styles.containerPreview}>
                        <Box sx={{ width: '45%', paddingRight: '20px' }}>
                            <TextField
                                label="Starting Position"
                                type="number"
                                value={startingPosition}
                                onChange={(e) => setStartingPosition(Math.min(40, Math.max(0, Number(e.target.value))))}
                                sx={{ mt: 2, width: '100%', marginBottom: '20px' }}
                                inputProps={{ min: 0, max: 40 }}
                            />

                            <Autocomplete
                                sx={{ width: '100%' }}
                                multiple
                                freeSolo
                                open={open}
                                onOpen={handleOpen}
                                onClose={handleClose}
                                isOptionEqualToValue={(option, value) =>
                                    typeof option !== 'string' && typeof value !== 'string' && option.accessionNo === value.accessionNo
                                }
                                getOptionLabel={(option) => typeof option === 'string' ? option : `${option.accessionNo} - ${option.section}`}
                                options={['Select All', ...options.filter(option => !selectedAccessions.some(selected => selected.accessionNo === option.accessionNo))]}
                                loading={loading}
                                value={selectedAccessions}
                                onChange={handleSelectionChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Accession Numbers"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            <Button variant="contained" onClick={() => handlePrint()} disabled={selectedAccessions.length === 0} sx={{ mt: 2 }}>
                                Print Barcodes
                            </Button>
                        </Box>

                        {/* Barcode Display Section */}
                        <Box className={styles.barcodePreview}>
                            <Typography sx={{ mb: 2, textAlign: 'center' }}>Sample page layout</Typography>
                            <Box className={styles.barcodeGrid}>
                                {Array.from({ length: 21 }).map((_, i) => {
                                    const index = i - startingPosition;
                                    if (index < 0 || index >= selectedAccessions.length) {
                                        return (
                                            <Box key={`placeholder-${i}`} className={styles.barcodeCell} sx={{ width: '190px', height: '70px', border: '1px dashed #ccc' }} />
                                        );
                                    } else {
                                        const barcode = selectedAccessions[index];
                                        return (
                                            <Box key={`barcode-${index}`} className={styles.barcodeCell}>
                                                <Typography variant="caption" className={styles.barcodeTitle}>
                                                    {barcode.section}<br />UNC eLibrary
                                                </Typography>
                                                <svg id={`barcode-${index}`} className={styles.barcode} />
                                            </Box>
                                        );
                                    }
                                })}
                            </Box>
                        </Box>
                    </Container>
                </Container>

                <Container>
                    {/* New Box for Actual Page Size (Print Layout) */}
                    <Box ref={contentRef} className={styles.printA4}>
                        <Box className={styles.printA4Grid}>
                            {Array.from({ length: 40 }).map((_, i) => {
                                const index = i - startingPosition;
                                if (index < 0 || index >= selectedAccessions.length) {
                                    return (
                                        <Box key={`print-placeholder-${i}`} className={styles.barcodeA4Cell} sx={{ width: '250px', height: '100px' }} />
                                    );
                                } else {
                                    const barcode = selectedAccessions[index];
                                    return (
                                        <Box key={`print-barcode-${index}`} className={styles.printA4Cell}>
                                            <Typography variant="caption" className={styles.barcodeA4Title}>
                                                {barcode.section}<br />UNC eLibrary
                                            </Typography>
                                            <svg id={`print-barcode-${index}`} className={styles.barcodeA4} />
                                        </Box>
                                    );
                                }
                            })}
                        </Box>
                    </Box>
                </Container>
            </Container>
            <Copyright />
        </Box>
    );
};

export default BarcodeGenerator;
