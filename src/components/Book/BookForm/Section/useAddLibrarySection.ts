import { useMutation } from "@tanstack/react-query"
import { LibrarySections } from "../../../../types"

export const useAddLibrarySection = () => {
    const {
        mutate: addLibrarySection,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (librarySection: LibrarySections) => {
            const { default: addLibrarySection } = await import("../../../../services/Catalog/Section/addLibrarySection")
            return addLibrarySection(librarySection);
        }
    })
    return {
        addLibrarySection,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}