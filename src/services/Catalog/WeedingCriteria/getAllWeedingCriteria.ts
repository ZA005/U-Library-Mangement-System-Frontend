import { WeedingCriteria } from "../../../types/Catalog/WeedingCriteria";
import { createApiClient } from "../../api/apiClient";

const getAllWeedingCriteria = async (): Promise<WeedingCriteria[]> => {
    const apiClient = createApiClient('admin');

    try {
        const response = await apiClient.get<WeedingCriteria[]>('weeding-criteria', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default getAllWeedingCriteria;