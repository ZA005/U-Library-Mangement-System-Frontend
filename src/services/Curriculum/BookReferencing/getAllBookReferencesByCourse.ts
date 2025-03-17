import { createApiClient } from "../../api/apiClient";
import { BookReference } from "../../../types";

const getAllBookReferencesByCourse = async (id: number): Promise<BookReference[]> => {
    const apiClient = createApiClient("public/reference")
    try {
        const response = await apiClient.get(`/course/${id}`)
        return response.data
    } catch (e) {
        console.error(e)
        throw e;
    }
}

export default getAllBookReferencesByCourse