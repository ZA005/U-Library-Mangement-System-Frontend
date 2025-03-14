import { useQuery } from "@tanstack/react-query"
import { Books } from "../../../types"
import getAllBooks from "../../../services/Catalog/getAllBooks"

export const useFetchAllBooks = () => {
    const {
        isLoading,
        data,
        error,
        refetch,
    } = useQuery<Books[]>({
        queryKey: ["allBooks"],
        queryFn: getAllBooks,
    });

    return {
        isLoading,
        error,
        data,
        refetch
    }
}