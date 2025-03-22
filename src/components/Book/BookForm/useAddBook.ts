import { useMutation } from "@tanstack/react-query"
import { Books } from "../../../types"

export const useAddBook = () => {
    const {
        mutate: addBook,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (book: Books) => {
            const { default: addBook } = await import("../../../services/Catalog/addBook")
            return addBook(book);
        }
    })

    return {
        addBook,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}