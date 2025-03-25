import { createApiClient } from "../../api/apiClient";
import { Transaction } from "../../../types";

const getTransactionHistory = async (): Promise<Transaction[]> => {
    const apiClient = createApiClient("public")
    try {
        const response = await apiClient.get("/transactionsHistory");
        console.log("RESULTS: ", response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export default getTransactionHistory