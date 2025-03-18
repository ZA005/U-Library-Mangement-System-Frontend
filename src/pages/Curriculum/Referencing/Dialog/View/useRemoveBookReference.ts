import { useMutation } from "@tanstack/react-query";
import removeBookReference from "../../../../../services/Curriculum/BookReferencing/removeBookReference";

export const useRemoveBookReference = () => {
    const {
        mutate: removeReference,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (id: number) => {
            return await removeBookReference(id);
        }
    })
    return {
        removeReference,
        isPending,
        isError,
        error,
        isSuccess,
        data
    };
}