import { ReferenceForExport } from "../types/Curriculum/ReferenceForExport";

export function exportReferenceDataAsCSV(referenceData: ReferenceForExport[]) {

    console.log("DATA INSIDE EXPORTING:", referenceData)
    if (!referenceData || referenceData.length === 0) {
        console.error("No reference data to export.");
        return;
    }

    const programName = referenceData[0].program_name || "Program Name";

    const headers = [
        "YEAR LEVELS",
        "SEMESTER",
        "COURSE CODE",
        "COURSE NAME",
        "BOOK TITLES",
        "AUTHOR(S)",
        "COPIES",
        "COPYRIGHT"
    ];

    const rows: string[][] = [];

    // Push Program Name as title row
    rows.push([programName]);
    // Push header row
    rows.push(headers);

    // Group by course_code + course_name
    const groupedByCourse = referenceData.reduce<Record<string, ReferenceForExport[]>>((acc, ref) => {
        const key = `${ref.course_code}|${ref.course_name}|${ref.year_level}|${ref.semester}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(ref);
        return acc;
    }, {});

    // Fill in data
    Object.entries(groupedByCourse).forEach(([key, refs]) => {
        const [course_code, course_name, year_level, semester] = key.split("|");

        refs.forEach((ref, index) => {
            const row = [
                index === 0 ? formatYearLevel(year_level) : "",
                index === 0 ? formatSemester(semester) : "",
                index === 0 ? ref.course_code : "",
                index === 0 ? ref.course_name : "",
                ref.book_title,
                ref.authors,
                ref.copies.toString(),
                new Date(ref.copyright).getFullYear().toString()
            ];
            rows.push(row);
        });
    });

    // Convert to CSV string
    const csvContent = rows.map(row => row.map(escapeCSVValue).join(",")).join("\r\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${programName.replace(/\s+/g, "_")}_BookReferences.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Helper to properly escape CSV values
function escapeCSVValue(value: string) {
    if (value == null) return "";
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        value = value.replace(/"/g, '""');
        return `"${value}"`;
    }
    return value;
}

// Helper to format Year Level
function formatYearLevel(yearLevel: string | number): string {
    const num = Number(yearLevel);
    switch (num) {
        case 1: return "1st Year";
        case 2: return "2nd Year";
        case 3: return "3rd Year";
        case 4: return "4th Year";
        default: return `${num}th Year`;
    }
}

// Helper to format Semester
function formatSemester(semester: string | number): string {
    const num = Number(semester);
    switch (num) {
        case 1: return "1st Semester";
        case 2: return "2nd Semester";
        default: return `${num}th Semester`;
    }
}
