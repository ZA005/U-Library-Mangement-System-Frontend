import { useMutation } from "@tanstack/react-query";
import { AccountData } from "../../types";
export const useRegister = () => {

    const {
        mutate: registerMutation,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async ({ account }: { account: AccountData; }) => {
            const { default: register } = await import("../../services/Authentication/register")
            return register(account);
        }
    })

    return {
        register: registerMutation,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    };
}