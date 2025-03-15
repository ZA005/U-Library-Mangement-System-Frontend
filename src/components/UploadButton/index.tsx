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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await validateAndParseCSV(file, fileType, (parsedData) => {
                onSuccess(parsedData);
            });
        } catch (error) {
            if (onError) onError(error.toString());
        } finally {
            setIsUploading(false);
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
                disabled={isUploading || isLoading}
            />
            <label htmlFor={`csv-upload-${fileType}`}>
                <Button
                    variant="contained"
                    component="span"
                    disabled={isUploading || isLoading}
                    sx={{
                        backgroundColor: "#d32f2f",
                        "&:disabled": {
                            backgroundColor: "#b71c1c",
                        },
                    }}
                >
                    {isUploading || isLoading ? <CircularProgress size={24} /> : label}
                </Button>
            </label>
        </>
    );
};

export default CSVUploadButton;
