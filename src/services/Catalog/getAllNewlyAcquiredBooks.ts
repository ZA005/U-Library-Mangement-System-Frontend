import { Books } from "../../types";
import { createApiClient } from "../api/apiClient";

const getAllNewlyAcquiredBooks = async (): Promise<Books[]> => {
    const apiClient = createApiClient('adminuser');

    try {
        const response = await apiClient.get<Books[]>('book/fetchAllNewlyAcquired', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default getAllNewlyAcquiredBooks; 