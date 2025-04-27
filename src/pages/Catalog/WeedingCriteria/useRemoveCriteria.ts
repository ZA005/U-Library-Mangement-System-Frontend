import { useMutation } from "@tanstack/react-query";

export const useRemoveCriteria = () => {
    const {
        mutate: removeCriteria,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (id: number) => {
            const { default: removeCriteria } = await import("../../../services/Catalog/WeedingCriteria/removeCriteria");
            return await removeCriteria(id);
        }
    });

    return {
        removeCriteria,
        isPending,
        isError,
        error,
        isSuccess,
        data
    };
}