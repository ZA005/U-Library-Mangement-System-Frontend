import { Books } from "../../types";
import { createApiClient } from "../api/apiClient";

const addBook = async (book: Books): Promise<Books> => {
    const apiClient = createApiClient('admin')

    try {
        const response = await apiClient.post('/book/save', book, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        return response.data;
    } catch (error) {
        console.error(error)
        throw error
    }
}

export default addBook; 
