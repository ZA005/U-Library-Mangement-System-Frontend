import { useMutation } from "@tanstack/react-query"

export const useSendResetPasswordOTP = () => {
    const {
        mutate: sendOTPResetPassword,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async ({ userId, isActivation }: { userId: string; isActivation: boolean }) => {
            if (!userId) throw new Error("User ID is required");

            const { default: sendOTPResetPassword } = await import("../../../services/Authentication/sendOTPResetPassword")
            const result = await sendOTPResetPassword(userId, isActivation);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            return result;
        },
        onSuccess: (data) => {
            console.log("OTP sent successfully:", data);
        },
        onError: (error) => {
            console.error("Error sending OTP:", error);
        }
    });

    return { sendOTPResetPassword, isPending, isError, error, isSuccess, data };
};