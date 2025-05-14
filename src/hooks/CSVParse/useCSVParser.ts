import { useState } from "react";
import { parseCSVFile } from "./csvParser";
import { validateCSVHeaders } from "./csvValidator";
import { useSnackbarContext } from "../../contexts/SnackbarContext";

export const useCSVParser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [parseStatus, setParseStatus] = useState(false);
    const showSnackbar = useSnackbarContext();

    const validateAndParseCSV = async (file: File, type: string, onSuccess: (data: any[]) => void) => {
        if (!file) {
            showSnackbar("No file selected", "error")
            setParseStatus(false);
            return;
        }

        setIsLoading(true);
        setParseStatus(false);

        try {
            const parsedData = await parseCSVFile(file);
            console.log(parsedData)
            const validationResult = validateCSVHeaders(type, parsedData);

            console.log(parsedData)
            if (validationResult !== true) {
                showSnackbar(`${validationResult}`, "error")
                setParseStatus(false);
                return;
            }

            setParseStatus(true);
            showSnackbar(`CSV Parsed Successfully`, "success")
            onSuccess(parsedData);
        } catch (error) {
            showSnackbar(`${error instanceof Error ? error.message : "Unexpected error occurred."}`, "error")
            setParseStatus(false);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        parseStatus,
        validateAndParseCSV,
    };
};