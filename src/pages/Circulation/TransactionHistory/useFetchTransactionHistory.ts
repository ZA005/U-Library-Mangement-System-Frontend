import { useQuery } from "@tanstack/react-query";
import getTransactionHistory from "../../../services/Circulation/Transaction/getHistory";
import { Transaction } from "../../../types";

export const useFetchTransactionHistory = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Transaction[]>({
        queryKey: ["transactions"],
        queryFn: getTransactionHistory
    })
    return {
        isLoading,
        error,
        data,
        refetch
    }
}