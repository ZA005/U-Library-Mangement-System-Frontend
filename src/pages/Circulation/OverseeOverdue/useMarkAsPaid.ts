import { useMutation } from "@tanstack/react-query";

export const useMarkAsPaid = () => {
    const {
        mutate: markAsPaid,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (id: number) => {
            const { default: markAsPaid } = await import("../../../services/Circulation/Fine/markAsPaid");

            return markAsPaid(id);
        }
    })

    return {
        markAsPaid,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}