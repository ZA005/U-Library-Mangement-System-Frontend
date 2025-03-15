import { createApiClient } from "../../api/apiClient";
import { Program } from "../../../types";

const uploadPrograms = async (programs: Program[]): Promise<Program[]> => {
    const apiClient = createApiClient('public/programs')

    try {
        const response = await apiClient.post<Program[]>(`/upload`, programs, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default uploadPrograms