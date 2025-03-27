import { createApiClient } from "../../api/apiClient";
import { Loan } from "../../../types";

const getAllUnreturnedLoans = async (): Promise<Loan[]> => {
    const apiClient = createApiClient("adminuser/loan")

    try {
        const response = await apiClient.get("/unreturned", {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default getAllUnreturnedLoans