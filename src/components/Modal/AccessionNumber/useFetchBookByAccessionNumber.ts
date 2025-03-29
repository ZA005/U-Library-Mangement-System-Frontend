import { useQuery } from "@tanstack/react-query";
import getBookByAccessionNumber from "../../../services/Catalog/getBookByAccessionNumber";
import { Books } from "../../../types";

export const useFetchBookByAccessionNumber = (accessionNumber: string) => {
    const {
        data,
        error,
        isLoading
    } = useQuery<Books>({
        queryKey: ["book", accessionNumber],
        queryFn: () => getBookByAccessionNumber(accessionNumber),
        enabled: !!accessionNumber,
        retry: 1
    })

    return {
        data,
        error,
        isLoading
    }
}