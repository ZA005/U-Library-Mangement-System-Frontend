import { useQuery } from "@tanstack/react-query";
import getAllProgramsByDepartment from "../../../../services/Curriculum/Program/getAllProgramsByDepartment";
import { Program } from "../../../../types";

export const useFetchAllProgramsByDepartment = (id: string) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Program[]>({
        queryKey: ["programs", id],
        queryFn: () => getAllProgramsByDepartment(id),
        enabled: !!id
    })
    return {
        isLoading,
        error,
        data,
        refetch
    }
}