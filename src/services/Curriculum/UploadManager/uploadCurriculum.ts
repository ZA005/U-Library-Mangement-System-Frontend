import { createApiClient } from "../../api/apiClient";
import { Curriculum } from "../../../types";

export const uploadCurriculums = async (curriculums: Curriculum[]): Promise<Curriculum[]> => {
    const apiClient = createApiClient("public/curriculums")

    try {
        const response = await apiClient.post('/upload', curriculums);
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}
export default uploadCurriculums