import { useMutation } from "@tanstack/react-query";
import { Loan } from "../../../types";

export const useRenewLoan = () => {
    const {
        mutate: renewLoan,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (loan: Loan) => {
            const { default: renewLoan } = await import("../../../services/Circulation/Loan/renewLoan")

            return renewLoan(loan)
        }
    })
    return {
        renewLoan,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }

}