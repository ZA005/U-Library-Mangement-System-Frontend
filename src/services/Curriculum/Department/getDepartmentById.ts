import { createApiClient } from "../../api/apiClient";
import { Department } from "../../../types";

const getDepartmentById = async (id: number): Promise<Department> => {
    const apiClient = createApiClient("public/departments")
    try {
        const response = await apiClient.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export default getDepartmentById