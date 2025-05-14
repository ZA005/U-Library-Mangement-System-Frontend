import { createApiClient } from "../../api/apiClient";
import { Curriculum } from "../../../types";

export const uploadCurriculums = async (curriculums: Curriculum[]): Promise<Curriculum[]> => {
    const apiClient = createApiClient("public/curriculums")
    console.log("CURRICULUM INSIDE THE SERVICE:", curriculums)
    try {
        const response = await apiClient.post('/upload', curriculums, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}
export default uploadCurriculums