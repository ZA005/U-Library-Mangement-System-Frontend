import axios from "axios";

export interface Course {
    course_id: number;
    curr_id: string;
    course_code: string;
    course_name: string;
    year_level: number;
    sem: number;
}

const BASE_URL = "http://localhost:8080/";

export const getAllCourses = async (): Promise<Course[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/courses`);
        return response.data;
    } catch (error) {
        console.error("Error fetching subjects:", error)
        throw error;
    }
}

export const uploadCourses = async (courses: Course[]): Promise<Course[]> => {
    try {
        const response = await axios.post(`${BASE_URL}public/courses/upload`, courses);
        return response.data;
    } catch (error) {
        console.error("Error fetching subjects:", error)
        throw error;
    }
}
