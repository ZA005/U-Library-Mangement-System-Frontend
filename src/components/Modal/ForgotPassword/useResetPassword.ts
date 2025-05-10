import { useMutation } from "@tanstack/react-query";

export const useResetPassword = () => {
    const {
        mutate: resetPassword,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
            if (!userId) throw new Error("User ID is required");
            if (!newPassword) throw new Error("New password is required");

            const { default: resetPassword } = await import("../../../services/Authentication/resetPassword")
            const result = await resetPassword(userId, newPassword);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            return result;
        },
        onSuccess: (data) => {
            console.log("Password reset successfully:", data);
        },
        onError: (error) => {
            console.error("Error resetting password:", error);
        }
    });

    return { resetPassword, isPending, isError, error, isSuccess, data };
}