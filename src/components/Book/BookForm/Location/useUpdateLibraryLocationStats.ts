import { useMutation } from "@tanstack/react-query"

export const useUpdateLibraryLocationStatus = () => {
    const {
        mutate: updateStatus,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: boolean }) => {
            const { default: updateStatus } = await import("../../../../services/Catalog/Location/updateLibraryLocation")
            return updateStatus(id, status)
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
};