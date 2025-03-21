import { CallNumberRequest } from "../../types/Catalog/CallNumberRequest";
import { createApiClient } from "../api/apiClient";

const getCallNumber = async (): Promise<CallNumberRequest> => {
    const apiClient = createApiClient('admin');

    try {
        const response = await apiClient.get<CallNumberRequest>('book/generateCallNumber', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default getCallNumber; 