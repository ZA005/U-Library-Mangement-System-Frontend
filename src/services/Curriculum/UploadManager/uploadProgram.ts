import { createApiClient } from "../../api/apiClient";
import { Program } from "../../../types";

const uploadPrograms = async (programs: Program[]): Promise<Program[]> => {
    const apiClient = createApiClient("public/programs")

    try {
        const response = await apiClient.post('/upload', programs);
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}
export default uploadPrograms