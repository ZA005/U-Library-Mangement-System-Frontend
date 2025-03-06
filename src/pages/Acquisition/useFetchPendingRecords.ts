import { useQuery } from "@tanstack/react-query";
import getPendingRecords from "../../services/Acquisition/getPendingRecords";
import { AcquisitionRecord } from "../../types";

export const useFetchPendingRecords = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<AcquisitionRecord[]>({
        queryKey: ["pendingRecords"],
        queryFn: getPendingRecords,
    });

    return {
        isLoading,
        error,
        data,
        refetch
    };
};
