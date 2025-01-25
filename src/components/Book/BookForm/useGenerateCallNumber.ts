// hooks/useGenerateCallNumber.ts
import { useState, useEffect } from 'react';

type UseGenerateCallNumberProps = {
    bookTitle: string;
    author: string;
    ddcNumber?: string;
};

const useGenerateCallNumber = ({ bookTitle, author, ddcNumber }: UseGenerateCallNumberProps): string => {
    const [callNumber, setCallNumber] = useState('');

    useEffect(() => {
        const ddcClasses = [
            '000', '100', '200', '300', '400', '500', '600', '700', '800', '900'
        ];

        const determineDDCClass = (title: string): string => {
            if (title.toLowerCase().includes('psychology')) return '100';
            if (title.toLowerCase().includes('religion')) return '200';
            if (title.toLowerCase().includes('history')) return '900';
            return ddcClasses[Math.floor(Math.random() * ddcClasses.length)];
        };

        const selectedDDCNumber = ddcNumber || determineDDCClass(bookTitle);

        // Ensure author has a value before processing
        const safeAuthor = author ? author : 'Unknown';
        const cutterNumber = generateCutterNumber(safeAuthor);
        const year = new Date().getFullYear().toString();

        const newCallNumber = `${selectedDDCNumber} ${cutterNumber} ${year}`;
        setCallNumber(newCallNumber);
    }, [bookTitle, author, ddcNumber]);

    // Simplified function to generate Cutter number with a fallback
    const generateCutterNumber = (name: string): string => {
        if (!name) return '.U'; // Fallback for unknown author
        const firstLetter = name[0].toUpperCase();
        const numberPart = name.split(' ').pop()?.charCodeAt(0) || 0 - 64; // Safe access to charCodeAt
        return `.${firstLetter}${Math.max(1, numberPart)}`; // Ensure numberPart doesn't result in negative or zero
    };

    return callNumber;
};

export default useGenerateCallNumber;