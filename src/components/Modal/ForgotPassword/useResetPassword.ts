import { useMutation } from "@tanstack/react-query";
import { ResetPasswordInput } from "../../../types/User/PasswordChange";

export const useResetPassword = () => {
    const {
        mutate: resetPassword,
        isPending,
        isError,
        error,
        isSuccess,
        data,
    } = useMutation({
        mutationFn: async ({ userId, password, currentPassword }: ResetPasswordInput) => {
            if (!userId) throw new Error("User ID is required");
            if (!password) throw new Error("New password is required");

            const { default: resetPasswordAPI } = await import("../../../services/Authentication/resetPassword");
            const changePassReq = { password: password, ...(currentPassword ? { currentPassword } : {}) };
            return await resetPasswordAPI(userId, changePassReq);
        },
        onSuccess: (data) => {
            console.log("Password reset/change successful:", data);
        },
        onError: (error) => {
            console.error("Error during password reset/change:", error);
        }
    });

    return { resetPassword, isPending, isError, error, isSuccess, data };
};