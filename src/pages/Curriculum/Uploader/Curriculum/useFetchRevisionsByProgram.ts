import { useQuery } from "@tanstack/react-query";
import getRevisionsByProgram from "../../../../services/Curriculum/getRevisionsByProgram";

export const useFetchRevisionsByProgram = (id: number) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery({
        queryKey: ["revisions", id],
        queryFn: () => getRevisionsByProgram(id),
        enabled: !!id,
    })
    return {
        isLoading,
        error,
        data,
        refetch
    }
}