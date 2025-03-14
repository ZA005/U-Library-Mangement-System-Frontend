import { useQuery } from "@tanstack/react-query";
import getAllDepartments from "../../../../services/Curriculum/Department/getAllDepartment";
import { Department } from "../../../../types";

export const useFetchAllDepartments = () => {
    const {
        isLoading,
        data,
        error,
        refetch
    } = useQuery<Department[]>({
        queryKey: ["departments"],
        queryFn: getAllDepartments
    })

    return {
        isLoading,
        error,
        data,
        refetch
    }
}