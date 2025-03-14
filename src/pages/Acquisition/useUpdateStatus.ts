import { useMutation } from "@tanstack/react-query"

export const useUpdateCatalogStatus = () => {
    const {
        mutate: updateStatus,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async (id: number) => {
            const { default: updateStatus } = await import("../../services/Acquisition/updateStatus")
            return updateStatus(id)
        }
    })
    return {
        updateStatus,
        isPending,
        isError,
        error,
        isSuccess,
        data
    };
}