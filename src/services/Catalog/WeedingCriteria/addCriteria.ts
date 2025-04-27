import { WeedingCriteria } from "../../../types/Catalog/WeedingCriteria";
import { createApiClient } from "../../api/apiClient";

const addCriteria = async (criteria: WeedingCriteria) => {
    const apiClient = createApiClient("admin");
    try {
        const response = await apiClient.post<WeedingCriteria>('weeding-criteria', criteria, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add new weeding criteria:', error);
        throw error;
    }
}
export default addCriteria;