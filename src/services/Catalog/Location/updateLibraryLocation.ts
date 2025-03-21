import { LibraryLocations } from "../../../types/Catalog/LibraryLocation";
import { createApiClient } from "../../api/apiClient";

const updateLibraryLocation = async (id: number, status: boolean): Promise<LibraryLocations> => {
    const apiClient = createApiClient('admin');

    try {
        const response = await apiClient.put<LibraryLocations>(
            `location/${id}/status`,
            null, // No body to send
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

export default updateLibraryLocation; 