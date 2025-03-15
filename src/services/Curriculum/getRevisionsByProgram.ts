import { createApiClient } from "../api/apiClient";

const getRevisionsByProgram = async (id: number): Promise<number[]> => {
    const apiClient = createApiClient("public");
    try {
        const response = await apiClient.get<number[]>(`/curriculums/program/${id}/revisions`);
        return response.data;
    } catch (error) {
        console.error("Error fetching revisions:", error);
        throw error;
    }
};

export default getRevisionsByProgram;
