import { useMutation } from "@tanstack/react-query";
import { Course } from "../../../../types";

export const useUploadCourse = () => {
    const {
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (courses: Course[]) => {
            const { default: uploadCourses } = await import("../../../../services/Curriculum/UploadManager/uploadCourse")

            return uploadCourses(courses)
        }
    })

    return {
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}