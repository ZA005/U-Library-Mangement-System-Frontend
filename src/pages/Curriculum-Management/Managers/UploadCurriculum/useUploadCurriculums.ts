import { useState, useCallback } from "react";
import Papa from "papaparse";
import { Curriculum, uploadCurriculums } from "../../../../services/Curriculum/CurriculumService";

interface ParsedData {
    curriculumList: Curriculum[];
}

const requiredHeaders = ["curr_id", "program_id", "revision_no", "effectivity_sem", "effectivity_sy", "status"];

const validateHeaders = (headers: string[]): boolean => {
    return requiredHeaders.every(header => headers.includes(header));
};

const validateDataRow = (row: Record<string, string>): boolean => {
    return requiredHeaders.every(header => row[header]?.trim() !== "");
};

const parseCsvData = (rawData: Record<string, string>[]): ParsedData => {
    const curriculumList: Curriculum[] = rawData.map((row) => ({
        curr_id: row["curr_id"]?.trim() || "",
        program_id: row["program_id"]?.trim() || "",
        revision_no: row["revision_no"]?.trim() || "",
        effectivity_sem: row["effectivity_sem"]?.trim() || "",
        effectivity_sy: row["effectivity_sy"]?.trim() || "",
        status: row["status"]?.trim() || "",
    }));

    console.log("program list:", curriculumList)
    return { curriculumList };
};

const saveToDatabase = async (curriculumList: Curriculum[], setError: (error: string | null) => void) => {
    try {
        await uploadCurriculums(curriculumList);
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
                setError("Invalid CSV headers.\n Required headers: curr_id, program_id, revision_no, effectivity_sem, effectivity_sy, status");
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
                const { curriculumList } = parseCsvData(rawData);
                await saveToDatabase(curriculumList, setError);
                setParsedData({ curriculumList });
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
