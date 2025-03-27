import { createApiClient } from "../../api/apiClient";
import { Fine } from "../../../types";

const getAllNonPaidFines = async (): Promise<Fine[]> => {
    const apiClient = createApiClient("admin/fine")

    try {
        const response = await apiClient.get("/not-paid", {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default getAllNonPaidFines