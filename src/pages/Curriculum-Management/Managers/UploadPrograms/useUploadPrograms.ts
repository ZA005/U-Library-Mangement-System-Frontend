import { useState, useCallback } from "react";
import Papa from "papaparse";
import { Program, uploadPrograms } from "../../../../services/Curriculum/ProgramService";

interface ParsedData {
    programList: Program[];
}

const requiredHeaders = ["program_id", "dept_id", "code", "description", "status"];

const validateHeaders = (headers: string[]): boolean => {
    return requiredHeaders.every(header => headers.includes(header));
};

const validateDataRow = (row: Record<string, string>): boolean => {
    return requiredHeaders.every(header => row[header]?.trim() !== "");
};

const parseCsvData = (rawData: Record<string, string>[]): ParsedData => {
    const programList: Program[] = rawData.map((row) => ({
        prog_id: row["program_id"]?.trim() || "",
        dept_id: row["dept_id"]?.trim() || "",
        code: row["code"]?.trim() || "",
        description: row["description"]?.trim() || "",
        status: row["status"]?.trim() || "",
    }));

    console.log("program list:", programList)
    return { programList };
};

const saveToDatabase = async (programList: Program[], setError: (error: string | null) => void) => {
    try {
        await uploadPrograms(programList);
    } catch (error) {
        setError("There are duplicate programs in the CSV. Please review and remove any duplicates.");
        console.error("Error uploading programs:", error);
    }
};


const configureCsvParsing = (
    file: File,
    setError: (error: string | null) => void,
    setIsUploading: (isUploading: boolean) => void,
    setParsedData: (data: ParsedData | null) => void
) => {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
            const rawData = result.data as Record<string, string>[];

            // Validate headers
            if (rawData.length === 0) {
                setError("CSV file is empty.");
                setIsUploading(false);
                return;
            }

            const headers = Object.keys(rawData[0]);
            if (!validateHeaders(headers)) {
                setError("Invalid CSV headers. Required headers: program_id, dept_id, code, description, status");
                setIsUploading(false);
                return;
            }

            // Validate data
            const invalidRow = rawData.find((row) => !validateDataRow(row));
            if (invalidRow) {
                setError("CSV contains missing data in one or more rows.");
                setIsUploading(false);
                return;
            }

            try {
                const { programList } = parseCsvData(rawData);
                await saveToDatabase(programList, setError);
                setParsedData({ programList });
            } catch (error) {
                setError("Error processing CSV data.");
                console.error("CSV Parsing Error:", error);
            } finally {
                setIsUploading(false);
            }
        },
        error: (parseError) => {
            setError(parseError.message);
            setIsUploading(false);
        },
    });
};

export const useCsvUploader = () => {
    const [parsedData, setParsedData] = useState<ParsedData | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setError] = useState<string | null>(null);

    const uploadCsv = useCallback((file: File) => {
        if (!file) {
            setError("No file provided.");
            return;
        }

        if (file.type !== "text/csv") {
            setError("Invalid file type. Please upload a CSV file.");
            return;
        }

        setIsUploading(true);
        setError(null);
        configureCsvParsing(file, setError, setIsUploading, setParsedData);
    }, []);

    const reset = useCallback(() => {
        setParsedData(null);
        setIsUploading(false);
        setError(null);
    }, []);

    return { parsedData, isUploading, uploadError, uploadCsv, reset };
};
