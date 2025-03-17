import { createApiClient } from "../../api/apiClient";
import { BookReference } from "../../../types";

const addMultipleBookReference = async (newBookRef: BookReference[]): Promise<BookReference[]> => {
    const apiClient = createApiClient("public")
    try {
        const response = await apiClient.post(`/reference/multiple`, newBookRef)
        return response.data
    } catch (e) {
        console.error(e)
        throw e;
    }
}

export default addMultipleBookReference