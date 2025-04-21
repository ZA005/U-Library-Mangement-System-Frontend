import { useMutation } from "@tanstack/react-query"
import { WeedingInfo } from "../../../../types/Catalog/WeedingInfo"

export const useWeedBook = () => {
    const {
        mutate,
        isPending,
        data,
        error,
    } = useMutation({
        mutationFn: async (bookWeed: WeedingInfo) => {
            const { default: addWeedBook } = await import("../../../../services/Catalog/BookWeeding/addWeedBook")
            return addWeedBook(bookWeed);
        }
    })
    return {
        mutate,
        isPending,
        data,
        error,
    }
}