import { useMutation } from "@tanstack/react-query";
import { Department } from "../../../../types";

export const useUploadDepartments = () => {
    const {
        mutate: uploadDepartments,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (departments: Department[]) => {
            const { default: uploadDepartments } = await import("../../../../services/Curriculum/UploadManager/uploadDepartment")

            return uploadDepartments(departments);
        }
    })

    return {
        uploadDepartments,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}