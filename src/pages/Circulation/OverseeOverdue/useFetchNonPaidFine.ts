import { useQuery } from "@tanstack/react-query";
import getAllNonPaidFines from "../../../services/Circulation/Fine/fetchNonPaidFines";
import { Fine } from "../../../types";

export const useFetchNonPaidFines = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Fine[]>({
        queryKey: ["fines"],
        queryFn: getAllNonPaidFines
    })

    return {
        isLoading,
        error,
        data,
        refetch
    }
}