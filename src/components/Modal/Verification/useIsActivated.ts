import { useMutation } from "@tanstack/react-query";
// import { isActivated } from "../../../services/Authentication";

export const useIsActivated = () => {
    const {
        mutate: verifyUser,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async ({ user_id, isActivation }: { user_id: string; isActivation: boolean }) => {
            const { default: isActivated } = await import("../../../services/Authentication/isActivated")
            const result = await isActivated(user_id, isActivation);
            // await new Promise((resolve) => setTimeout(resolve, 3000));
            return result;
        },
    })
    return { verifyUser, isPending, isError, error, isSuccess, data };
}