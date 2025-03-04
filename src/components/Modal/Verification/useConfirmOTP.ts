import { useMutation } from "@tanstack/react-query";

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
            const { default: confirmOTP } = await import("../../../services/Authentication/confirmOTP")
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
