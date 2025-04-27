import { createApiClient } from "../../api/apiClient";
import { Transaction } from "../../../types";

const getIndividualTransactionHistory = async (id: string): Promise<Transaction[]> => {

    const apiClient = createApiClient("public")

    try {
        const response = await apiClient.get(`/transactionsHistory/${id}`)
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
}

export default getIndividualTransactionHistory