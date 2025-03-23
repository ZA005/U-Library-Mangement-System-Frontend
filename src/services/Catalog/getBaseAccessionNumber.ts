import { createApiClient } from "../api/apiClient"

const getBaseAccessionNumber = async (isbn13: string, locationCodeName: string): Promise<string> => {
    const apiClient = createApiClient('admin');

    try {
        const response = await apiClient.get<string>('book/fetchLatestBaseAccession', {
            params: { isbn13, locationCodeName },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export default getBaseAccessionNumber; 