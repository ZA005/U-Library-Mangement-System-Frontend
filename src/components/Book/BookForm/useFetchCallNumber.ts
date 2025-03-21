import { useQuery } from "@tanstack/react-query"
import { CallNumberRequest } from "../../../types/Catalog/CallNumberRequest"
import getCallNumber from "../../../services/Catalog/getCallNumber"

export const useFetchCallNumber = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<CallNumberRequest>({
        queryKey: ["callNumber"],
        queryFn: getCallNumber
    });

    return {
        isLoading,
        data,
        error,
        refetch
    }
}