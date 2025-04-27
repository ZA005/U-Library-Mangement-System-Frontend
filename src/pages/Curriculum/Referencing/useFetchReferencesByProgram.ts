import { useQuery } from "@tanstack/react-query";
import { exportReferencesByProgram } from "../../../services/Curriculum/BookReferencing/exportReferenceByProgram";
import { ReferenceForExport } from "../../../types/Curriculum/ReferenceForExport";
export const useFetchReferenceByProgram = (revisionNo: number, programId: number) => {

    const {
        data,
        error,
        isLoading
    } = useQuery<ReferenceForExport[]>({
        queryKey: ["data", revisionNo, programId],
        queryFn: () => exportReferencesByProgram(revisionNo, programId)
    })

    return {
        data,
        error,
        isLoading
    }
}