import { useMutation } from "@tanstack/react-query";
import { AcquisitionRecord } from "../../types";

export const useUploadRecords = () => {
    const {
        mutate: uploadRecords,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (acquisitionRecords: AcquisitionRecord[]) => {
            const { default: uploadRecords } = await import("../../services/Acquisition/addRecords")
            return uploadRecords(acquisitionRecords);
        }
    })

    return {
        uploadRecords,
        isPending,
        isError,
        error,
        isSuccess,
        data
    };
};
