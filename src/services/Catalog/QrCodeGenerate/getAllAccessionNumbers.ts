import { QrCodeLabels } from "../../../types/Catalog/AccessionNumbers";
import { createApiClient } from "../../api/apiClient";

const getAllAccessionNumbers = async (): Promise<QrCodeLabels[]> => {
    const apiClient = createApiClient('admin');

    try {
        const response = await apiClient.get<QrCodeLabels[]>('book/fetchAllAccessionNumber', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;

    }
}
export default getAllAccessionNumbers;