import { LibraryLocations } from "../../../types";
import { createApiClient } from "../../api/apiClient";

const addLibraryLocation = async (location: LibraryLocations): Promise<LibraryLocations> => {
    const apiClient = createApiClient('adminuser')

    try {
        const response = await apiClient.post('/location', location, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error(error)
        throw error
    }
}

export default addLibraryLocation; 