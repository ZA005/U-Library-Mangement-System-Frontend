import { createApiClient } from "../../api/apiClient";
import { Loan } from "../../../types";

const returnLoan = async (loan: Loan): Promise<Loan> => {
    const apiClient = createApiClient('adminuser/loan')
    try {
        const response = await apiClient.post<Loan>(`/return`, loan, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default returnLoan