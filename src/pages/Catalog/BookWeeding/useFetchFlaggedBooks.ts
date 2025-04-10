import { useQuery } from "@tanstack/react-query"
import getAllFlaggedBooks from "../../../services/Catalog/getAllFlaggedBooks"

export const useFetchFlaggedBooks = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery({
        queryKey: ["flaggedBooks"],
        queryFn: () => getAllFlaggedBooks(),
    })

    return {
        isLoading,
        data,
        error,
        refetch
    }
}