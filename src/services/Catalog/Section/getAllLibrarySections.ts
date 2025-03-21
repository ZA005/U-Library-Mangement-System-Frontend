import { LibrarySections } from "../../../types";
import { createApiClient } from "../../api/apiClient";

const getAllLibrarySections = async (locationId: number): Promise<LibrarySections[]> => {
    const apiClient = createApiClient('admin');

    try {
        const response = await apiClient.get<LibrarySections[]>(`section/${locationId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default getAllLibrarySections; 