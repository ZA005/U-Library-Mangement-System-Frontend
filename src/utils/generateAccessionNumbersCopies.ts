/**
 * Generates an array of accession numbers based on a base accession number and the number of copies.
 * @param baseAccessionNumber The base accession number (e.g., "CS-00001")
 * @param numberOfCopies The number of copies to generate accession numbers for
 * @returns An array of accession numbers (e.g., ["CS-00001 c.1", "CS-00001 c.2", "CS-00001 c.3"])
 */
export const generateAccessionNumbersCopies = (
    baseAccessionNumber: string | undefined,
    numberOfCopies: number | string | undefined
): string[] => {
    if (!baseAccessionNumber || !numberOfCopies) {
        return [];
    }

    const copies = parseInt(numberOfCopies as string, 10);
    if (isNaN(copies) || copies <= 0) {
        return [];
    }

    const accessionNumbers: string[] = [];
    for (let i = 1; i <= copies; i++) {
        accessionNumbers.push(`${baseAccessionNumber} c.${i}`);
    }

    return accessionNumbers;
};