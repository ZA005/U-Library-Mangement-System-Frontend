import { useMutation } from "@tanstack/react-query";
import { isActivated } from "../../../services/Authentication";

export const useIsActivated = () => {
    const {
        mutate: verifyUser,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async (user_id: string) => {
            const result = await isActivated(user_id);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            return result;
        },
    })
    return { verifyUser, isPending, isError, error, isSuccess, data };
}