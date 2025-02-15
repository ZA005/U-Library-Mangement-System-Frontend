import { useState } from "react";
import Papa from "papaparse";
import { AcquisitionRecord, addRecords, fetchAllPendingCatalogRecords } from "../../../../services/AcquisitionService";

export const useCSVParser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [parseStatus, setParseStatus] = useState(false);
    const expectedHeaders = [
        "book_title", "isbn", "publisher", "edition", "published_date",
        "purchase_price", "purchase_date", "acquired_date", "vendor",
        "vendor_location", "funding_source"
    ];

    const validateAndParseCSV = async (file: File, onSuccess: (data: AcquisitionRecord[]) => void) => {
        if (!file) {
            setErrorMessage("No file selected.");
            setParseStatus(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        setParseStatus(false); // Reset parse status at start

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                try {
                    if (result.data.length === 0) {
                        setErrorMessage("CSV file is empty or improperly formatted.");
                        setParseStatus(false);
                        return;
                    }

                    const fileHeaders = Object.keys(result.data[0]);
                    if (JSON.stringify(fileHeaders.sort()) !== JSON.stringify(expectedHeaders.sort())) {
                        setErrorMessage("CSV headers do not match the expected format.");
                        setParseStatus(false);
                        return;
                    }

                    const parsedData = result.data as unknown as AcquisitionRecord[];

                    await addRecords(parsedData);
                    const allRecords = await fetchAllPendingCatalogRecords();

                    setParseStatus(true); // Set to true only after successful parse and data save
                    setSuccessMessage("CSV Parsed Successfully!");
                    onSuccess(allRecords);
                } catch (error) {
                    setErrorMessage(
                        error instanceof Error
                            ? `Failed to add records: ${error.message}`
                            : "An unexpected error occurred while adding records."
                    );
                    setParseStatus(false);
                } finally {
                    setIsLoading(false);
                }
            },
            error: (err) => {
                setErrorMessage(`Parsing error: ${err.message}`);
                setParseStatus(false);
                setIsLoading(false);
            }
        });
    };

    return {
        isLoading,
        errorMessage,
        successMessage,
        parseStatus,
        validateAndParseCSV
    };
};
