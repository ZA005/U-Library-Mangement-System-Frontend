import { useQuery } from "@tanstack/react-query";
import getBookBy4Queries from "../../../../services/Catalog/getBookBy4Queries";
import { Books } from "../../../../types";

export const useFetchBookByQuery = (query: string) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Books[]>({
        queryKey: ["books", query],
        queryFn: () => getBookBy4Queries(query),
        enabled: !!query
    })

    return {
        isLoading,
        error,
        data,
        refetch
    }
}