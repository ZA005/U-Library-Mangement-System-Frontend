export const convertYear = (year: number) => {
    switch (year) {
        case 1:
            return "1st Year";
        case 2:
            return "2nd Year";
        case 3:
            return "3rd Year";
        case 4:
            return "4th Year";
        case 5:
            return "5th Year";
        default:
            return "Unknown Year";
    }
}

export const convertSem = (sem: number) => {
    switch (sem) {
        case 1:
            return "1 S";
        case 2:
            return "2";
        default:
            return "Unknown Semester";
    }
}