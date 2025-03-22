
import { createApiClient } from "../api/apiClient";

const getCallNumber = async (title: string, category: string, authors: string[],
    publishedDate: string): Promise<string> => {
    const apiClient = createApiClient('admin');

    try {
        const response = await apiClient.get<string>('book/generateCallNumber', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params: {
                title: title,
                category: category,
                authors: authors.join(','),
                publishedDate: publishedDate,
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default getCallNumber;