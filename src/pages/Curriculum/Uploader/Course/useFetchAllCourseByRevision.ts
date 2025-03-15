import { useQuery } from "@tanstack/react-query";
import getAllCourseByRevision from "../../../../services/Curriculum/Course/getAllCourseByRevision";
import { Course } from "../../../../types";

export const useFetchAllCourseByRevision = (revision_no: number) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Course[]>({
        queryKey: ["curriculums", revision_no],
        queryFn: () => getAllCourseByRevision(revision_no),
        enabled: !!revision_no
    })
    return {
        isLoading,
        error,
        data,
        refetch
    }
}