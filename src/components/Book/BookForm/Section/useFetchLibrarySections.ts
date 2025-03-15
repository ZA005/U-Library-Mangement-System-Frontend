import { useQuery } from "@tanstack/react-query"
import { LibrarySections } from "../../../../types"
import getAllLibrarySections from "../../../../services/Catalog/Section/getAllLibrarySections"

export const useFetchAllLibrarySections = (locationId: number) => {
    const {
        isLoading,
        data,
        error,
        refetch,
    } = useQuery<LibrarySections[]>({
        queryKey: ["librarySections", locationId],
        queryFn: () => getAllLibrarySections(locationId),
    });

    return {
        isLoading,
        data,
        error,
        refetch
    }
}