import { useState, useEffect } from 'react';
import { getLastAccessionNumber } from '../../../services/Cataloging/LocalBooksAPI';

interface UseGenerateAccessionNumbersProps {
    locationPrefix: string;
    copies: number;
}

export const useGenerateAccessionNumbers = ({
    locationPrefix,
    copies,
}: UseGenerateAccessionNumbersProps): string[] => {
    const [accessionNumbers, setAccessionNumbers] = useState<string[]>([]);

    useEffect(() => {
        if (!locationPrefix) return;
        const fetchLastAccessionNumber = async () => {
            try {
                const lastAccessionNumber = await getLastAccessionNumber();
                const accessionParts = lastAccessionNumber.split(' c.');

                const lastNumber = parseInt(accessionParts[0].split('-')[1]) || 0;
                const newNumbers: string[] = [];

                for (let i = 0; i < copies; i++) {
                    const newNumber = lastNumber + i + 1;
                    const formattedNumber = newNumber.toString().padStart(6, '0');
                    let newAccessionNumber = `${locationPrefix}-${formattedNumber}`;

                    // Append copy count for all cases, explicitly showing 'c.1' for a single copy
                    newAccessionNumber += ` c.${i + 1}`;
                    newNumbers.push(newAccessionNumber);
                }

                setAccessionNumbers(newNumbers);
            } catch (error) {
                console.error('Error fetching last accession number:', error);
                setAccessionNumbers(['Error']);
            }
        };

        fetchLastAccessionNumber();
    }, [locationPrefix, copies]);

    return accessionNumbers;
};