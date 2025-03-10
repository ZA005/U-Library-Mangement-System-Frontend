import { createApiClient } from "../../api/apiClient";
import { Course } from "../../../types";

const getAllCurriculums = async (id: number): Promise<Course[]> => {
    const apiClient = createApiClient("public")
    try {
        const response = await apiClient.get(`/courses/program/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export default getAllCurriculums