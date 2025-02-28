import { useMutation } from "@tanstack/react-query";
import { confirmOTP } from "../../../services/Authentication";

export const useConfirmOTP = () => {
    const {
        mutate: confirmOTPMutation,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
            return confirmOTP(email, otp);
        },
    });

    return {
        confirmOTP: confirmOTPMutation,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    };
};
