import { useQuery } from "@tanstack/react-query"
import { Books } from "../../../types"
import getNewlyAcquired from "../../../services/Catalog/getNewlyAcquired";

export const useFetchNewlyAcquired = () => {
    const {
        isLoading,
        data,
        error,
        refetch,
    } = useQuery<Books[]>({
        queryKey: ["newlyAcquired"],
        queryFn: getNewlyAcquired,
    });

    return {
        isLoading,
        data,
        error,
        refetch
    }
}