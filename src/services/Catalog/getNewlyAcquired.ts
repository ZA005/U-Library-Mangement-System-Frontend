import { Books } from "../../types";
import { createApiClient } from "../api/apiClient";

const getNewlyAcquired = async (): Promise<Books[]> => {
    const apiClient = createApiClient('public');

    try {
        const response = await apiClient.get<Books[]>('book/fetchAllNewlyAcquired');
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default getNewlyAcquired; 