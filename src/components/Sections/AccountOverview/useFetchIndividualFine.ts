import { useQuery } from "@tanstack/react-query";
import { getIndividualFine } from "../../../services/Circulation/Fine/getIndividualFine";

export const useFetchIndividualFine = (id: string) => {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ["fine", id],
        queryFn: () => getIndividualFine(id)
    })

    return {
        isLoading,
        error,
        data,
    }
}