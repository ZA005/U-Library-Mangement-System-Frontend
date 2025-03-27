import { useQuery } from "@tanstack/react-query";
import { AdvanceSearchParams } from "../../types/Catalog/advanceSearchParams";
import { Books } from "../../types";
import getBookSearched from "../../services/Catalog/getBookSearched";

export const useFetchBookSearched = (advanceSearchParams: AdvanceSearchParams) => {
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