import { Books } from "../../types";
import { createApiClient } from "../api/apiClient";

const getBookBy4Queries = async (query: string): Promise<Books[]> => {
    const apiClient = createApiClient('adminuser');

    try {
        const response = await apiClient.get<Books[]>(`/book/query/${query}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default getBookBy4Queries; 