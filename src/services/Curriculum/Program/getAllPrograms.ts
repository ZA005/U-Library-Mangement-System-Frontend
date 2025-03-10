import { createApiClient } from "../../api/apiClient";
import { Program } from "../../../types";

const getAllPrograms = async (): Promise<Program[]> => {
    const apiClient = createApiClient("public")
    try {
        const response = await apiClient.get("/programs");
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export default getAllPrograms