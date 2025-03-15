import { useQuery } from "@tanstack/react-query";
import getAllCurriculumsByProgram from "../../../../services/Curriculum/getAllCurriculumsByProgram";
import { Curriculum } from "../../../../types";

export const useFetchAllCurriculumByProgram = (id: number) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Curriculum[]>({
        queryKey: ["curriculums", id],
        queryFn: () => getAllCurriculumsByProgram(id),
        enabled: !!id
    })
    return {
        isLoading,
        error,
        data,
        refetch
    }
}