import { Books } from "../../types";
import { createApiClient } from "../api/apiClient";

const getAllBooks = async (): Promise<Books[]> => {
    const apiClient = createApiClient('adminuser');

    try {
        const response = await apiClient.get<Books[]>('book/fetchAll', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        console.log("ALL BOOKS", response.data)
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default getAllBooks; 