import { useQuery } from "@tanstack/react-query"
import getAllWeedingCriteria from "../../../services/Catalog/WeedingCriteria/getAllWeedingCriteria"

export const useFetchWeedingCriterias = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery({
        queryKey: ["weeding-criteria"],
        queryFn: getAllWeedingCriteria
    })
    return {
        isLoading,
        error,
        data,
        refetch
    }
}