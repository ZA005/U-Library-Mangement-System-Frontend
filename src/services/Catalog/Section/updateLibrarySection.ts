import { LibrarySections } from "../../../types";
import { createApiClient } from "../../api/apiClient";

const updateLibrarySection = async (id: number, status: boolean): Promise<LibrarySections> => {
    const apiClient = createApiClient('admin');

    try {
        const response = await apiClient.put<LibrarySections>(
            `section/${id}/status`,
            null,
            {
                params: { status },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default updateLibrarySection; 