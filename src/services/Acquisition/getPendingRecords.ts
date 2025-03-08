import { createApiClient } from "../api/apiClient";
import { AcquisitionRecord } from "../../types";

const getPendingRecords = async (): Promise<AcquisitionRecord[]> => {
    const apiClient = createApiClient('adminuser')

    try {
        const response = await apiClient.get<AcquisitionRecord[]>(`acquisition/pending`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // console.log(response.data)
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default getPendingRecords