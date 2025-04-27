import { useMutation } from "@tanstack/react-query";
import { WeedingCriteria } from "../../../../types/Catalog/WeedingCriteria";

export const useAddCriteria = () => {
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
            const { default: addCriteria } = await import("../../../../services/Catalog/WeedingCriteria/addCriteria");
            return addCriteria(criteria);
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
}