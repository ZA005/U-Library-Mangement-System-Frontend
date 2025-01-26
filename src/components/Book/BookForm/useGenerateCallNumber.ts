import { useState, useEffect } from 'react';

type UseGenerateCallNumberProps = {
    bookTitle: string;
    author: string;
    ddcNumber?: string;
    publishedDate: string;
};

const useGenerateCallNumber = ({ bookTitle, author, ddcNumber, publishedDate }: UseGenerateCallNumberProps): string => {
    const [callNumber, setCallNumber] = useState('');

    useEffect(() => {
        // Function to get the Dewey Decimal Class Number
        const getClassNumber = (category: string): string | null => {
            const ddcClasses = {
                'Psychology': '100',
                'Religion': '200',
                'History': '900',
            };

            // Try to find a matching category
            return ddcClasses[category] || null;
        };

        // Function to normalize the title to get the relevant first letter (for call number)
        const getRelevantTitleLetter = (title: string): string => {
            const normalizedTitle = title.replace(/[^a-zA-Z]/g, '').toLowerCase();
            return normalizedTitle.charAt(0).toUpperCase(); // Get the first letter of the title
        };

        // Generate Cutter number based on the author's name (using the Sanborn Cutter System)
        const generateCutterNumber = (authorName: string): string => {
            if (!authorName) return 'A99'; // Default Cutter Number if no author is provided

            const nameParts = authorName.split(' ');
            const lastName = nameParts[nameParts.length - 1]; // Get the last name

            return generateCutterSanbornNumber(lastName.toLowerCase());
        };

        // Function to generate the Cutter number using Sanborn rules
        const generateCutterSanbornNumber = (lastName: string): string => {
            if (!lastName) {
                return 'A99'; // Return default if the last name is empty
            }

            // Ensure the last name is at least 3 characters long by padding with 'A' if necessary
            let firstLetter = lastName[0].toUpperCase();
            let secondLetter = lastName[1] || 'A'; // Default to 'A' if no second letter
            let thirdLetter = lastName[2] || 'A';  // Default to 'A' if no third letter

            let numberPart = '';
            // Generate the number part based on the first letter
            const consonants = ['b', 'd', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u'];
            const vowelSwitch = {
                'a': '2', 'e': '3', 'i': '4', 'o': '5', 'u': '6',
                'y': '7'
            };

            if (vowelSwitch[firstLetter]) {
                numberPart = vowelSwitch[firstLetter];
            } else if (consonants.includes(firstLetter.toLowerCase())) {
                numberPart = '9'; // Default for consonant letters
            }

            return `${firstLetter}${secondLetter}${thirdLetter}${numberPart}`;
        };

        const category = 'History'; // Example category, could come from the book data
        const classNumber = ddcNumber || getClassNumber(category);
        const cutterNumber = generateCutterNumber(author);
        const publicationYear = publishedDate ? publishedDate.split('-')[0] : '0000';

        // Process the title for the first relevant letter
        const titleLetter = getRelevantTitleLetter(bookTitle);

        const fullCallNumber = `${classNumber}.${cutterNumber} ${titleLetter} ${publicationYear}`;
        setCallNumber(fullCallNumber);
    }, [bookTitle, author, ddcNumber, publishedDate]);

    return callNumber;
};

export default useGenerateCallNumber;
