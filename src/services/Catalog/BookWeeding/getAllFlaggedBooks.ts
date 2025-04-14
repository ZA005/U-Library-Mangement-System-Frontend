import { WeedingInfo } from "../../../types/Catalog/WeedingInfo";
import { createApiClient } from "../../api/apiClient";


const getAllFlaggedBooks = async (): Promise<WeedingInfo[]> => {
    const apiClient = createApiClient('admin');

    try {
        const response = await apiClient.get<WeedingInfo[]>('book/weed/status', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default getAllFlaggedBooks;