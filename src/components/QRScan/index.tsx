import React from "react";
import { Box, Button } from "@mui/material";
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

interface QrScannerProps {
    onScan: (value: string) => void;
    onClose: () => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScan, onClose }) => {
    const handleScan = (err: any, result: any) => {
        if (result) {
            onScan(result.text);
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2000,
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'white',
                    padding: 3,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <BarcodeScannerComponent
                    width={500}
                    height={500}
                    onUpdate={handleScan}
                />
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{ marginTop: 2 }}
                >
                    Close Scanner
                </Button>
            </Box>
        </Box>
    );
};

export default QrScanner;