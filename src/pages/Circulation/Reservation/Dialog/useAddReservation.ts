import { useMutation } from "@tanstack/react-query";
import { Reservation } from "../../../../types";

export const useAddReservation = () => {
    const {
        mutate: addReservation,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (reservation: Reservation) => {
            const { default: addReservation } = await import("../../../../services/Circulation/Reservation/addReservation")

            return addReservation(reservation)
        }
    })

    return {
        addReservation,
        isPending,
        isError,
        error,
        isSuccess,
        data
    }
}