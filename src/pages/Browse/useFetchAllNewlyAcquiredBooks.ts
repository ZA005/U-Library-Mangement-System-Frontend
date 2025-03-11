import { useQuery } from "@tanstack/react-query"
import { Books } from "../../types"
import getAllNewlyAcquiredBooks from "../../services/Catalog/getAllNewlyAcquiredBooks";

export const useFetchAllNewlyAcquiredBooks = () => {
    const {
        isLoading,
        data,
        error,
        refetch,
    } = useQuery<Books[]>({
        queryKey: ["allNewlyAcquiredBooks"],
        queryFn: getAllNewlyAcquiredBooks,
    });

    return {
        isLoading,
        error,
        data,
        refetch
    }
}