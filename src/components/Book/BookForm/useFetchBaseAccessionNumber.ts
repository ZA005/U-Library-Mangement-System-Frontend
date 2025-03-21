import { useQuery } from "@tanstack/react-query"
import getBaseAccessionNumber from "../../../services/Catalog/getBaseAccessionNumber";

export const useFetchBaseAccessionNumber = (isbn13: string, locationCodeName: string) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<string>({
        queryKey: ["baseAccesionNumber", isbn13, locationCodeName],
        queryFn: () => {
            if (!isbn13 || !locationCodeName) return "";
            return getBaseAccessionNumber(isbn13, locationCodeName);
        },
        enabled: !!isbn13 && !!locationCodeName,
    });

    return {
        isLoading,
        data,
        error,
        refetch
    }
}