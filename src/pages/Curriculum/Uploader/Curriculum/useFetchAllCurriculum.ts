import { useQuery } from "@tanstack/react-query";
import getAllCurriculums from "../../../../services/Curriculum/getAllCurriculum";
import { Curriculum } from "../../../../types";

export const useFetchAllCurriculum = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Curriculum[]>({
        queryKey: ["curriculum"],
        queryFn: () => getAllCurriculums(),
    })

    return {
        isLoading,
        data,
        error,
        refetch
    }
}