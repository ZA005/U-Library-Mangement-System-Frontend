import { useQuery } from "@tanstack/react-query";
import getIndividualTransactionHistory from "../../../services/Circulation/Transaction/getIndividualHistory";
import { Transaction } from "../../../types";

export const useFetchIndividualTransactionHistory = (id: string) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Transaction[]>({
        queryKey: ["transactions", id],
        queryFn: () => getIndividualTransactionHistory(id)
    })

    return {
        isLoading,
        error,
        data,
        refetch
    }
}