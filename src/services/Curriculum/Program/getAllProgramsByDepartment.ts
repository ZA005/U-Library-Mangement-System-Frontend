import { createApiClient } from "../../api/apiClient";
import { Program } from "../../../types";

const getAllProgramsByDepartment = async (id: string): Promise<Program[]> => {
    const apiClient = createApiClient("public/programs")
    try {
        const response = await apiClient.get(`/department/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
}

export default getAllProgramsByDepartment

