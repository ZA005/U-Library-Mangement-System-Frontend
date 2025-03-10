import { createApiClient } from "../../api/apiClient";
import { Department } from "../../../types";

const getAllDepartments = async (): Promise<Department[]> => {
    const apiClient = createApiClient("public")
    try {
        const response = await apiClient.get("/departments");
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export default getAllDepartments