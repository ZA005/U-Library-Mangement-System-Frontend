import { useMutation } from "@tanstack/react-query";
import { UserData } from "../../types";

export const useUploadUsers = () => {
    const {
        mutate: uploadUsers,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (users: UserData[]) => {
            const { default: uploadUsers } = await import("../../services/Users/uploadUsers")
            return uploadUsers(users);
        }
    })

    return {
        uploadUsers,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}