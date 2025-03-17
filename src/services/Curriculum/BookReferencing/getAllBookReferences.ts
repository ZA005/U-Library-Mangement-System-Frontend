import { createApiClient } from "../../api/apiClient";
import { BookReference } from "../../../types";

const getAllBookReferences = async (): Promise<BookReference[]> => {
    const apiClient = createApiClient("public")
    try {
        const response = await apiClient.get("/reference");
        return response.data
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default getAllBookReferences