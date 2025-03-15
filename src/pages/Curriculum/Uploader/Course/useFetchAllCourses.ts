import { useQuery } from "@tanstack/react-query";
import getAllCourses from "../../../../services/Curriculum/Course/getAllCourses";
import { Course } from "../../../../types";

export const useFetchAllCourses = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Course[]>({
        queryKey: ["curriculum"],
        queryFn: () => getAllCourses(),
    })

    return {
        isLoading,
        data,
        error,
        refetch
    }
}