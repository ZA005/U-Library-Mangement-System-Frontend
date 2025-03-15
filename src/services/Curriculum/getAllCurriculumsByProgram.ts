import { createApiClient } from "../api/apiClient";
import { Curriculum } from "../../types";

const getAllCurriculumsByProgram = async (id: number): Promise<Curriculum[]> => {
    const apiClient = createApiClient("public")
    try {
        const response = await apiClient.get(`/curriculums/program/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export default getAllCurriculumsByProgram