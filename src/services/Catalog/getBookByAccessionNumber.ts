import { Books } from "../../types";
import { createApiClient } from "../api/apiClient";

const getBookByAccessionNumber = async (accessionNumber: string): Promise<Books> => {
    const apiClient = createApiClient('adminuser');

    try {
        const response = await apiClient.get<Books>(`/book/accession/${accessionNumber}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // console.log("BOOK:", response.data)
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default getBookByAccessionNumber; 