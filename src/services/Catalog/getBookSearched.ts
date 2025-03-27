import { Books } from "../../types";
import { AdvanceSearchParams } from "../../types/Catalog/advanceSearchParams";
import { createApiClient } from "../api/apiClient";

const getBookSearched = async (advanceSearchParams: AdvanceSearchParams): Promise<Books[]> => {
    const apiClient = createApiClient('adminuser');

    try {
        const response = await apiClient.post<Books[]>('book/advanceSearch', advanceSearchParams, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        return response.data;
    } catch (error) {
        console.error(error)
        throw error
    }
}

export default getBookSearched; 