import { useQuery } from "@tanstack/react-query";
import getUserData from "../../../services/Authentication/getUserData";
import { UserData } from "../../../types";

export const useFetchUser = (user_id: string) => {
    const { data, isLoading, error } = useQuery<UserData>({
        queryKey: ["user", user_id],
        queryFn: () => getUserData(user_id),
        enabled: !!user_id
    });

    return { data, isLoading, error };
};