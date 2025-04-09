import { useQuery } from "@tanstack/react-query";
import { SearchParams } from "../../types/Catalog/SearchParams";
import { Books } from "../../types";
import getBookSearched from "../../services/Catalog/getBookSearched";

export const useFetchBookSearched = (advanceSearchParams: SearchParams) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Books[]>({
        queryKey: ["bookSearched", advanceSearchParams],
        queryFn: () => getBookSearched(advanceSearchParams),
        enabled: false,
    });

    return {
        isLoading,
        data,
        error,
        refetch
    }
}