import { useQuery } from "@tanstack/react-query";
import { Books } from "../../../types";
import getBookAdvanceSearched from "../../../services/Catalog/getBookAdvanceSearched";
import { AdvanceSearchParams } from "../../../types/Catalog/AdvanceSearchParams";

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