import { useQuery } from "@tanstack/react-query";
import getAllUnreturnedLoans from "../../../services/Circulation/Loan/fetchUnreturnedLoans";
import { Loan } from "../../../types";

export const useFetchUnreturnedLoan = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Loan[]>({
        queryKey: ['loans'],
        queryFn: getAllUnreturnedLoans
    })

    return {
        isLoading,
        error,
        data,
        refetch
    }
}