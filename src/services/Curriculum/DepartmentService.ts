import axios from "axios";

export interface Department {
    id: number;
    name: string;
    status: number;
}
const BASE_URL = "http://localhost:8080/";

// Fetch all departments
export const getAllDepartments = async (): Promise<Department[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/departments`);
        // console.log('Response:', response)
        return response.data;
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
};

// Fetch a department by ID
export const getDepartmentById = async (id: number): Promise<Department> => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching department with ID ${id}:`, error);
        throw error;
    }
};

// Add a new department
export const addDepartment = async (newDepartment: Department): Promise<Department> => {
    try {
        const response = await axios.post(`${BASE_URL}public/departments`, newDepartment);
        console.log('Department added:', response.data);
        return response.data;  // Return the added department
    } catch (error) {
        console.error("Error adding department:", error);
        throw error;  // Throw error if request fails
    }
};

// Update an existing department
export const updateDepartment = async (id: number, department: Department): Promise<Department> => {
    try {
        const response = await axios.put(`${BASE_URL}public/departments/${id}`, department);
        return response.data;
    } catch (error) {
        console.error(`Error updating department with ID ${id}:`, error);
        throw error;
    }
};