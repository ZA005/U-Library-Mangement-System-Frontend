import { useMutation } from "@tanstack/react-query";
import { register } from "../../services/Authentication";
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
            console.log("ACCOUNT: ", account)
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