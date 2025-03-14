import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useCSVParser } from "../../hooks/CSVParse/useCSVParser";

interface CSVUploadButtonProps {
    fileType: string;
    onSuccess: (parsedData: any) => void;
    onError?: (error: string) => void;
    label?: string;
}

const CSVUploadButton: React.FC<CSVUploadButtonProps> = ({ fileType, onSuccess, onError, label = "Upload CSV" }) => {
    const { isLoading, validateAndParseCSV } = useCSVParser();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            validateAndParseCSV(file, fileType, (parsedData) => {
                onSuccess(parsedData);
                setIsUploading(false);
            }).catch((error) => {
                if (onError) onError(error.toString());
                setIsUploading(false);
            });
            (event.target as HTMLInputElement).value = "";
        }
    };

    return (
        <>
            <input
                type="file"
                accept=".csv"
                id={`csv-upload-${fileType}`}
                style={{ display: "none" }}
                onChange={handleFileUpload}
            />
            <label htmlFor={`csv-upload-${fileType}`}>
                <Button
                    variant="contained"
                    component="span"
                    disabled={isLoading || isUploading}
                    sx={{
                        backgroundColor: "#d32f2f"
                    }}
                >
                    {isLoading || isUploading ? <CircularProgress size={24} /> : label}
                </Button>
            </label>
        </>
    );
};

export default CSVUploadButton;
