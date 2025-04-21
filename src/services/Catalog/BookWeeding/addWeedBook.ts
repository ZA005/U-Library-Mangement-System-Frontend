import { WeedingInfo } from "../../../types/Catalog/WeedingInfo";
import { createApiClient } from "../../api/apiClient";

const addWeedBook = async (bookWeed: WeedingInfo): Promise<WeedingInfo> => {
    const apiClient = createApiClient("admin");
    try {
        const response = await apiClient.post<WeedingInfo>(
            'book/weeding/weed', bookWeed, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error(error)
        throw error
    }
}
export default addWeedBook;