import { useCallback } from "react";

// A function to convert year level
const convertYearLevel = (year: number): string => {
    switch (year) {
        case 1:
            return "1st year";
        case 2:
            return "2nd year";
        case 3:
            return "3rd year";
        case 4:
            return "4th year";
        case 5:
            return "5th year";
        default:
            return `${year}th year`;
    }
};

// A function to convert semester
const convertSemester = (sem: number): string => {
    switch (sem) {
        case 1:
            return "1st Semester";
        case 2:
            return "2nd Semester";
        default:
            return "Unknown Semester";
    }
};

// Custom hook that returns both the year level and semester converter
const useConverter = () => {
    const yearLevelConverter = useCallback((year: number) => convertYearLevel(year), []);
    const semesterConverter = useCallback((sem: number) => convertSemester(sem), []);

    return {
        yearLevelConverter,
        semesterConverter,
    };
};

export default useConverter;
