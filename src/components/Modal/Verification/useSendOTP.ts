import { useMutation } from "@tanstack/react-query";

export const useSendOTP = () => {
    const {
        mutate: sendOtp,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async ({ userId, isActivation }: { userId: string; isActivation: boolean }) => {
            if (!userId) throw new Error("User ID is required");

            const { default: sendOTP } = await import("../../../services/Authentication/sendOTP")
            const result = await sendOTP(userId, isActivation);
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

    return { sendOtp, isPending, isError, error, isSuccess, data };
};
