import { Books } from "../../types";
import { SRUFormData } from "../../types/Catalog/SRUFormData";
import { createApiClient } from "../api/apiClient";

const getGoogleBooks = async (formData: SRUFormData): Promise<Books[]> => {
    const apiClient = createApiClient('sru');

    try {
        const response = await apiClient.post<Books[]>('googlebooks/search', formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;


    } catch (error) {
        console.error(error)
        throw error
    }
}

export default getGoogleBooks; 