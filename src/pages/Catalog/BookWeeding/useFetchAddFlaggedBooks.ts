import { useMutation } from "@tanstack/react-query";
import addFlaggedBooks from "../../../services/Catalog/BookWeeding/addFlaggedBooks";

export const useFetchAddFlaggedBooks = () => {
    const {
        mutate,
        isPending: isLoading,
        data,
        error,
        reset,
    } = useMutation<string, Error, string>({
        mutationFn: (initiator: string) => addFlaggedBooks(initiator),
        onError: (err) => {
            console.error("Mutation error:", err);
        },
    });

    return {
        initiateWeeding: mutate,
        isLoading,
        data,
        error,
        reset,
    };
};