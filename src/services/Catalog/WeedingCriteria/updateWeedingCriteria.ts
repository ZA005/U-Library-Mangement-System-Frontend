import { WeedingCriteria } from "../../../types/Catalog/WeedingCriteria";
import { createApiClient } from "../../api/apiClient";

const updateWeedingCriteria = async (criteria: WeedingCriteria) => {
    const apiClient = createApiClient("admin/weeding-criteria");
    try {
        const response = await apiClient.put<WeedingCriteria>('update', criteria, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update weeding criteria status:', error);
        throw error;
    }
}

export default updateWeedingCriteria;
// This function updates the weeding criteria in the backend by sending a PUT request to the specified endpoint with the updated criteria data.