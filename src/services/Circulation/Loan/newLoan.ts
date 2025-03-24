import { createApiClient } from "../../api/apiClient";
import { Loan } from "../../../types/Circulation/Loan";

const newLoan = async (loan: Loan): Promise<Loan> => {
    const apiClient = createApiClient("adminuser")
    try {
        const response = await apiClient.post("/loan/add", loan, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export default newLoan