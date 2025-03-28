import { useMutation } from "@tanstack/react-query";
import { Loan } from "../../../types";

export const useReturnLoan = () => {
    const {
        mutate: returnLoan,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (loan: Loan) => {
            const { default: returnLoan } = await import("../../../services/Circulation/Loan/returnLoan")

            return returnLoan(loan)
        }
    })
    return {
        returnLoan,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }

}