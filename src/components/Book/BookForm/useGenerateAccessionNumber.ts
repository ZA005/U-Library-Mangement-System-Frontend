import { useState, useEffect } from 'react';
import { getLastAccessionNumber } from '../../../services/Cataloging/LocalBooksAPI';

type UseGenerateAccessionNumberProps = {
    location: string;
    copies: number;
};

const useGenerateAccessionNumber = ({
    location,
    copies,
}: UseGenerateAccessionNumberProps): string => {
    const [accessionNumber, setAccessionNumber] = useState('');
    const locationPrefix = getLocationPrefix(location);

    useEffect(() => {
        const fetchLastAccessionNumber = async () => {
            try {
                const lastAccessionNumber = await getLastAccessionNumber();
                const accessionParts = lastAccessionNumber.split(' c.');

                const lastNumber = parseInt(accessionParts[0].split('-')[1]) || 0;

                const newNumber = lastNumber + 1;
                const formattedNumber = newNumber.toString().padStart(6, '0');

                let newAccessionNumber = `${locationPrefix}-${formattedNumber}`;

                // Append copy count for all cases, explicitly showing 'c.1' for a single copy
                if (copies >= 1) {
                    newAccessionNumber += ` c.${copies}`;
                }

                setAccessionNumber(newAccessionNumber);
            } catch (error) {
                console.error('Error fetching last accession number:', error);
                setAccessionNumber('Error');
            }
        };

        fetchLastAccessionNumber();
    }, [locationPrefix, copies]);

    return accessionNumber;
};

const getLocationPrefix = (location: string) => {
    switch (location) {
        case 'eLibrary': return 'E';
        case 'Graduate Studies Library': return 'GS';
        case 'Law Library': return 'L';
        case 'Engineering and Architecture Library': return 'EA';
        case 'High School Library': return 'HS';
        case 'Elementary Library': return 'EL';
        default: return '';
    }
};

export default useGenerateAccessionNumber;