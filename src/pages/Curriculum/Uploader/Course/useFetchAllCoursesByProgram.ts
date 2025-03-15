import { useQuery } from "@tanstack/react-query";
import getAllCoursesByProgram from "../../../../services/Curriculum/Course/getAllCoursesByProgram";
import { Course } from "../../../../types";

export const useFetchAllCourseByProgram = (id: number) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Course[]>({
        queryKey: ["curriculums", id],
        queryFn: () => getAllCoursesByProgram(id),
        enabled: !!id
    })
    return {
        isLoading,
        error,
        data,
        refetch
    }
}