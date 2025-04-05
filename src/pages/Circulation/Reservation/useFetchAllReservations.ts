import { useQuery } from "@tanstack/react-query";
import getAllReservation from "../../../services/Circulation/Reservation/getAllReservations";
import { Reservation } from "../../../types";

export const useFetchAllReservations = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Reservation[]>({
        queryKey: ["transactions"],
        queryFn: getAllReservation
    })
    return {
        isLoading,
        error,
        data,
        refetch
    }
}