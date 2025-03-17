import { useQuery } from "@tanstack/react-query";
import getBookByID from "../../../../../services/Catalog/getBookByID";
import { Books } from "../../../../../types";

export const useFetchBookByID = (id: number) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Books>({
        queryKey: ["book", id],
        queryFn: () => getBookByID(id),
        enabled: !!id
    })

    return {
        isLoading,
        error,
        data,
        refetch
    }
}