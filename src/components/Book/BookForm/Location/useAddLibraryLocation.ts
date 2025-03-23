import { useMutation } from "@tanstack/react-query"
import { LibraryLocations } from "../../../../types"

export const useAddLibraryLocation = () => {
    const {
        mutate: addLibraryLocation,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async (libraryLocation: LibraryLocations) => {
            const { default: addLibraryLocation } = await import("../../../../services/Catalog/Location/addLibraryLocation")
            return addLibraryLocation(libraryLocation);
        }
    })
    return {
        addLibraryLocation,
        isPending,
        isError,
        error,
        isSuccess,
        data
    };
} 