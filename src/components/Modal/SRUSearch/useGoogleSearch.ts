import { useQuery } from "@tanstack/react-query";
import { SRUFormData } from "../../../types/Catalog/SRUFormData";
import { Books } from "../../../types";
import getGoogleBooks from "../../../services/Catalog/getGoogleBooks";

export const useFetchGoogleBooks = (formData: SRUFormData) => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Books[]>({
        queryKey: ["google-books", formData],
        queryFn: () => getGoogleBooks(formData),
        enabled: false
    });

    return {
        isLoading,
        data,
        error,
        refetch
    }

}