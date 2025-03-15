import { useMutation } from "@tanstack/react-query";
import { Program } from "../../../../types";

export const useUploadPrograms = () => {
    const {
        mutate: uploadPrograms,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (programs: Program[]) => {
            const { default: uploadPrograms } = await import("../../../../services/Curriculum/UploadManager/uploadProgram")

            return uploadPrograms(programs);
        }
    })

    return {
        uploadPrograms,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}