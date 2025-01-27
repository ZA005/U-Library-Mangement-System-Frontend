import axios from "axios";

export interface Subject {
    id: number;
    program_id: number;
    program_name: string;
    department_name: string;
    subject_name: string;
    year: number;
    status: number;
}

const BASE_URL = "http://localhost:8080/";

export const getAllSubjects = async (): Promise<Subject[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/subjects`);
        return response.data;
    } catch (error) {
        console.error("Error fetching subjects:", error)
        throw error;
    }
}

export const addSubject = async (newSubject: Subject): Promise<Subject> => {
    try {
        const response = await axios.post(`${BASE_URL}public/subjects`, newSubject);
        return response.data;
    } catch (error) {
        console.error("Error adding subject:", error)
        throw error;
    }
}

// Add multiple subjects
export const addSubjectInBulk = async (subjects: Subject[]): Promise<Subject[]> => {
    try {
        const response = await axios.post(`${BASE_URL}public/subjects/bulk`, subjects);
        console.log("Subjects added:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding subjects:", error);
        throw error;
    }
};

export const updateSubject = async (id: number, subject: Subject): Promise<Subject> => {
    try {
        const response = await axios.put(`${BASE_URL}public/subjects/${id}`, subject);
        return response.data;
    } catch (error) {
        console.error(`Error updating subject with ID: ${id}`, error);
        throw error;
    }
}

export const getAllSubjectsByProgram = async (id: number): Promise<Subject[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/subjects/program/${id}`)

        return response.data;
    } catch (error) {
        console.error("Error fetching subjects:", error);
        throw error;
    }
}