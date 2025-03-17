import { useQuery } from "@tanstack/react-query";
import getAllBookReferencesByCourse from "../../../../../services/Curriculum/BookReferencing/getAllBookReferencesByCourse";
import { BookReference } from "../../../../../types";

export const useFetchBookReferencesByCourse = (id: number) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<BookReference[]>({
        queryKey: ["bookreferences", id],
        queryFn: () => getAllBookReferencesByCourse(id),
        enabled: !!id
    })

    return {
        isLoading,
        error,
        data,
        refetch
    }
}