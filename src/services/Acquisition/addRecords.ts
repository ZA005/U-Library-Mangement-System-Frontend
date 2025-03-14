import { createApiClient } from "../api/apiClient";
import { AcquisitionRecord } from "../../types";

const addRecords = async (records: AcquisitionRecord[]): Promise<AcquisitionRecord[]> => {

    const apiClient = createApiClient('adminuser')

    try {
        const response = await apiClient.post<AcquisitionRecord[]>(`acquisition/add-record`, records, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default addRecords