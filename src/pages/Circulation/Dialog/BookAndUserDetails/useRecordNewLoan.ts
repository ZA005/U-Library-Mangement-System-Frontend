import { useMutation } from "@tanstack/react-query";
import { Loan } from "../../../../types/Circulation/Loan";

export const useRecordNewLoan = () => {
    const {
        mutate: recordLoan,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (loan: Loan) => {
            const { default: recordNewLoan } = await import("../../../../services/Circulation/Loan/newLoan"
            )
            return recordNewLoan(loan);
        }
    })

    return {
        recordLoan,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}