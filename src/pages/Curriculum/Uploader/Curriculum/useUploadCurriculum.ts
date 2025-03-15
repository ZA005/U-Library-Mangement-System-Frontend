import { useMutation } from "@tanstack/react-query";
import { Curriculum } from "../../../../types";

export const useUploadCurriculums = () => {
    const {
        mutate: uploadCurriculums,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (curriculums: Curriculum[]) => {
            const { default: uploadCurriculums } = await import("../../../../services/Curriculum/UploadManager/uploadCurriculum")
            console.log("CURRICULUM", curriculums)
            return uploadCurriculums(curriculums);
        }
    })

    return {
        uploadCurriculums,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}