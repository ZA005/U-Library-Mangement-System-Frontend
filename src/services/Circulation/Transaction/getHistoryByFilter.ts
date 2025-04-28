import { createApiClient } from "../../api/apiClient";
import { Transaction } from "../../../types";

const getTransactionHistoryByFilter = async (filter: string): Promise<Transaction[]> => {

    const apiClient = createApiClient("public")

    try {
        const response = await apiClient.get(`/transactionsHistory/type/${filter}`)
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
}

export default getTransactionHistoryByFilter