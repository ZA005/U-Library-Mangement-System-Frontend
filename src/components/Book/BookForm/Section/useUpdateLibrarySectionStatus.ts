import { useMutation } from "@tanstack/react-query"

export const useUpdateLibrarySectionStatus = () => {
    const {
        mutate: updateSectionStatus,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: boolean }) => {
            const { default: updateSectionStatus } = await import("../../../../services/Catalog/Section/updateLibrarySection")
            return updateSectionStatus(id, status)
        }
    })

    return {
        updateSectionStatus,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}