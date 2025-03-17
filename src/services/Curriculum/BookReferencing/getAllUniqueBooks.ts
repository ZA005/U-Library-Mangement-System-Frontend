import { createApiClient } from "../../api/apiClient";
import { Books } from "../../../types";

const getAllUniqueBooks = async (): Promise<Books[]> => {
    const apiClient = createApiClient("public")
    try {
        const response = await apiClient.get("/reference/book");
        return response.data
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default getAllUniqueBooks