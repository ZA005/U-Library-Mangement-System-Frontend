import { useQuery } from "@tanstack/react-query"
import getAllAccessionNumbers from "../../../services/Catalog/QrCodeGenerate/getAllAccessionNumbers"

export const useFetchAllAccessionNumbers = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery({
        queryKey: ["fetchAllAccessionNumber"],
        queryFn: getAllAccessionNumbers
    })
    return {
        isLoading,
        error,
        data,
        refetch
    }
}