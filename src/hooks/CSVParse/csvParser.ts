import Papa from "papaparse";

export const parseCSVFile = (file: File): Promise<unknown[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                if (result.data.length === 0) {
                    reject(new Error("CSV file is empty or improperly formatted."));
                } else {
                    resolve(result.data);
                }
            },
            error: (err) => reject(new Error(`Parsing error: ${err.message}`)),
        });
    });
};
