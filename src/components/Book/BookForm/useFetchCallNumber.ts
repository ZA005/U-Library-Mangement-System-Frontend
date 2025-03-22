import { useQuery } from "@tanstack/react-query";
import getCallNumber from "../../../services/Catalog/getCallNumber";

export const useFetchCallNumber = (
    title: string,
    category: string,
    authors: string[],
    publishedDate: string,
) => {
    const {
        isLoading,
        data,
        error,
        refetch,
    } = useQuery<string>({
        queryKey: ["callNumber", title, category, authors, publishedDate],
        queryFn: () => getCallNumber(title, category, authors, publishedDate),
        enabled: false
    });

    return {
        isLoading,
        data,
        error,
        refetch,
    };
};