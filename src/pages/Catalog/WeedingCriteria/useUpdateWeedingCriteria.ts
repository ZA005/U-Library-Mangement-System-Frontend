import { useMutation } from "@tanstack/react-query";
import { WeedingCriteria } from "../../../types/Catalog/WeedingCriteria";

export const useUpdateWeedingCriteria = () => {
    const {
        mutate,
        mutateAsync,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (criteria: WeedingCriteria) => {
            const { default: updateWeedingCriteria } = await import("../../../services/Catalog/WeedingCriteria/updateWeedingCriteria");
            return updateWeedingCriteria(criteria);
        }
    });

    return {
        mutate,
        mutateAsync,
        isPending,
        isError,
        error,
        isSuccess,
        data
    };
};
