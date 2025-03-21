import { useQuery } from "@tanstack/react-query"
import { LibraryLocations } from "../../../../types/Catalog/LibraryLocation"
import getAllLibraryLocations from "../../../../services/Catalog/Location/getAllLibraryLocations";

export const useFetchAllLibraryLocations = () => {
    const {
        isLoading,
        data,
        error,
        refetch,
    } = useQuery<LibraryLocations[]>({
        queryKey: ["libraryLocations"],
        queryFn: getAllLibraryLocations,
    });

    return {
        isLoading,
        data,
        error,
        refetch
    }
}