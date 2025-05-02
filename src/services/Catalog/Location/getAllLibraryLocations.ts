import { LibraryLocations } from "../../../types/Catalog/LibraryLocation";
import { createApiClient } from "../../api/apiClient";

const getAllLibraryLocations = async (): Promise<LibraryLocations[]> => {
    const apiClient = createApiClient('adminuser');

    try {
        const response = await apiClient.get<LibraryLocations[]>('location', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default getAllLibraryLocations; 