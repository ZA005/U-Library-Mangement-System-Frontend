import axios from "axios";

export interface Program {
    prog_id: number;
    dept_id: string;
    department_name: string;
    department_code: string
    code: string;
    description: string;
    status: number;
}

const BASE_URL = "http://localhost:8080/";

export const getAllPrograms = async (): Promise<Program[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/programs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export const addProgram = async (newProgram: Program): Promise<Program> => {
    try {
        const response = await axios.post(`${BASE_URL}public/programs`, newProgram);
        console.log('Department added:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding program:", error)
        throw error;
    }
}

// Add multiple programs
export const uploadPrograms = async (programs: Program[]): Promise<Program[]> => {
    try {
        const response = await axios.post(`${BASE_URL}public/programs/upload`, programs);
        if (response.status >= 200 && response.status < 300) {
            console.log("Programs added:", response.data);
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error adding programs:", error);
        throw error;
    }
};

export const updateProgram = async (id: number, program: Program): Promise<Program> => {
    try {
        const response = await axios.put(`${BASE_URL}public/programs/${id}`, program);
        return response.data;
    } catch (error) {
        console.error(`Error updating program with ID ${id}`, error);
        throw error;
    }
}

export const getAllProgramsByDepartment = async (id: string): Promise<Program[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/programs/department/${id}`);
        console.log('Response', response)
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
}