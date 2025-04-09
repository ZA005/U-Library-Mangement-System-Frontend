import { useQuery } from "@tanstack/react-query";
import { Books } from "../../../types";
import { AdvanceSearchParams } from "../../../types/Catalog/AdvanceSearchParams";
import getBookAdvanceSearched from "../../../services/Catalog/getBookAdvanceSearched";

export const useFetchAdvanceSearch = (advanceSearchParams: AdvanceSearchParams) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Books[]>({
        queryKey: ["bookSearched", advanceSearchParams],
        queryFn: () => getBookAdvanceSearched(advanceSearchParams),
        enabled: false,
    });

    return {
        isLoading,
        data,
        error,
        refetch
    }
}