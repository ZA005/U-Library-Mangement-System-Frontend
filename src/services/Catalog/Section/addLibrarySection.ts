import { LibrarySections } from "../../../types";
import { createApiClient } from "../../api/apiClient";

const addLibrarySection = async (section: LibrarySections): Promise<LibrarySections> => {
    const apiClient = createApiClient('admin')
    try {
        const response = await apiClient.post('/section', section, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error(error)
        throw error
    }
}

export default addLibrarySection; 