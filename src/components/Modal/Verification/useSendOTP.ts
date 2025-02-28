import { useMutation } from "@tanstack/react-query";
import { sendOTP } from "../../../services/Authentication";

export const useSendOTP = () => {
    const {
        mutate: sendOtp,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async (userId: string) => {
            if (!userId) throw new Error("User ID is required");
            const result = await sendOTP(userId);
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
