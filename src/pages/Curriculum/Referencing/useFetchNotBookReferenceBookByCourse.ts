import { useQuery } from "@tanstack/react-query";
import getAllNotReferencedBookByCourse from "../../../services/Curriculum/BookReferencing/getAllNotReferencedBookByCourse";
import { Books } from "../../../types";

export const useFetchNotReferenceBookByCourse = (id: number) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Books[]>({
        queryKey: ["books", id],
        queryFn: () => getAllNotReferencedBookByCourse(id),
        enabled: !!id
    })

    return {
        isLoading,
        error,
        data,
        refetch
    }
}