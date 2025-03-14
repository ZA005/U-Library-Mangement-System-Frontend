export interface Course {
    id: number;
    // CURRICULUM
    curr_id: string;
    revision_no: number;

    // PROGRAM
    program_id: number;
    program_code: string;
    program_description: string;

    course_code: string;
    course_name: string;
    year_level: number;
    sem: number;
}