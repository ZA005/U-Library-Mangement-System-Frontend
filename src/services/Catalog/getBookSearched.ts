import { Books } from "../../types";
import { createApiClient } from "../api/apiClient";

const getBookSearched = async (advanceSearchParams: any): Promise<Books[]> => {
    const apiClient = createApiClient('adminuser');

    try {
        const response = await apiClient.get<Books[]>('book/advanceSearch', advanceSearchParams)
    } catch (error) {

    }
}