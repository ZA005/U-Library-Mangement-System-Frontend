import { useQuery } from "@tanstack/react-query";
import getAllPrograms from "../../../../services/Curriculum/Program/getAllPrograms";
import { Program } from "../../../../types";

export const useFetchAllPrograms = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Program[]>({
        queryKey: ["programs"],
        queryFn: getAllPrograms
    })

    return {
        isLoading,
        error,
        data,
        refetch
    }
}