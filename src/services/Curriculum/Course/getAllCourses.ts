import { createApiClient } from "../../api/apiClient";
import { Course } from "../../../types";

const getAllCurriculums = async (): Promise<Course[]> => {
    const apiClient = createApiClient("public")
    try {
        const response = await apiClient.get("/courses");
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export default getAllCurriculums