import { useQuery } from "@tanstack/react-query";
import getTransactionHistoryByFilter from "../../../services/Circulation/Transaction/getHistoryByFilter";

export const useFetchTransactionHistoryByFilter = (filter: string) => {
    const {
        data,
        error,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ['transactions', filter],
        queryFn: () => getTransactionHistoryByFilter(filter)
    })

    return {
        data,
        error,
        isLoading,
        refetch
    }
}