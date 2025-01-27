import { useState, useCallback } from "react";
import Papa from "papaparse";
import { Department, addDepartmentInBulk } from "../services/Curriculum/DepartmentService";
import { Program, addProgramInBulk } from "../services/Curriculum/ProgramService";
import { addSubjectInBulk, Subject } from "../services/Curriculum/SubjectService";

interface ParsedData {
    departmentList: string[];
    programList: {
        department: string;
        name: string;
    }[];
    subjectList: {
        department: string;
        program: string;
        name: string;
        year: string;
    }[];
}

const requiredHeaders = ["Department", "Program", "Subjects", "Year"];

const validateHeaders = (headers: string[]): boolean => {
    return requiredHeaders.every(header => headers.includes(header));
};

const validateDataRow = (row: Record<string, string>): boolean => {
    return requiredHeaders.every(header => row[header]?.trim() !== "");
};

const parseCsvData = (rawData: Record<string, string>[]): ParsedData => {
    const departmentSet = new Set<string>();
    const programMap = new Map<string, Set<string>>();
    const subjectMap = new Map<string, Map<string, Set<{ name: string; year: string }>>>();

    rawData.forEach((row) => {
        const department = row["Department"]?.trim() || "";
        const program = row["Program"]?.trim() || "";
        const subject = row["Subjects"]?.trim() || "";
        const year = row["Year"]?.trim() || "";

        if (department) {
            departmentSet.add(department);

            if (program) {
                if (!programMap.has(department)) {
                    programMap.set(department, new Set());
                }
                programMap.get(department)?.add(program);

                if (subject && year) {
                    if (!subjectMap.has(department)) {
                        subjectMap.set(department, new Map());
                    }
                    const programSubjects =
                        subjectMap.get(department)?.get(program) || new Set();
                    programSubjects.add({ name: subject, year });
                    subjectMap.get(department)?.set(program, programSubjects);
                }
            }
        }
    });

    const departmentList = Array.from(departmentSet);
    const programList: ParsedData["programList"] = [];
    const subjectList: ParsedData["subjectList"] = [];

    programMap.forEach((programs, department) => {
        programs.forEach((program) => {
            programList.push({ department, name: program });

            const subjects = subjectMap.get(department)?.get(program) || new Set();
            subjects.forEach(({ name, year }) => {
                subjectList.push({
                    department,
                    program,
                    name,
                    year,
                });
            });
        });
    });

    return { departmentList, programList, subjectList };
};

const saveToDatabase = async (
    departmentList: string[],
    programList: { department: string; name: string }[],
    subjectList: { department: string; program: string; name: string; year: string }[]
) => {
    const departments: Department[] = departmentList.map((name) => ({
        index: null,
        name,
        status: 1,
    }));

    const programs: Program[] = programList.map(({ department, name }) => ({
        id: null,
        department_id: null,
        department_name: department,
        name,
        status: 0,
    }));

    const subjects: Subject[] = subjectList.map(({ department, program, name, year }) => ({
        id: null,
        program_id: null,
        program_name: program,
        department_name: department,
        subject_name: name,
        year,
        status: 1,
    }));

    await addDepartmentInBulk(departments);
    await addProgramInBulk(programs);
    await addSubjectInBulk(subjects);
};

const configureCsvParsing = (file: File, setError: (error: string | null) => void, setIsUploading: (isUploading: boolean) => void, setParsedData: (data: ParsedData | null) => void) => {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
            const rawData = result.data as Record<string, string>[];

            // Validate headers
            const headers = Object.keys(rawData[0]);
            if (!validateHeaders(headers)) {
                setError("Invalid CSV headers. Required headers: Department, Program, Subjects, Year.");
                setIsUploading(false);
                return;
            }

            // Validate data
            const invalidRow = rawData.find((row) => !validateDataRow(row));
            if (invalidRow) {
                setError("CSV contains missing data in one or more rows.");
                setIsUploading(false);
                return;
            }

            try {
                const { departmentList, programList, subjectList } = parseCsvData(rawData);
                saveToDatabase(departmentList, programList, subjectList);
                setParsedData({ departmentList, programList, subjectList });
            } catch (error) {
                setError("Error processing CSV data.");
                throw error;
            } finally {
                setIsUploading(false);
            }
        },
        error: (parseError) => {
            setError(parseError.message);
            setIsUploading(false);
        },
    });
};

export const useCsvUploader = () => {
    const [parsedData, setParsedData] = useState<ParsedData | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadCsv = useCallback((file: File) => {
        if (!file) {
            setError("No file provided.");
            return;
        }

        if (file.type !== "text/csv") {
            setError("Invalid file type. Please upload a CSV file.");
            return;
        }

        setIsUploading(true);
        setError(null);
        configureCsvParsing(file, setError, setIsUploading, setParsedData);
    }, []);

    const reset = useCallback(() => {
        setParsedData(null);
        setIsUploading(false);
        setError(null);
    }, []);

    return { parsedData, isUploading, error, uploadCsv, reset };
};
