import { useQuery } from "@tanstack/react-query";
import getAccountData from "../../../services/Authentication/getAccountData";
import { AccountData } from "../../../types";

export const useFetchAccount = (user_id: string) => {

    const { data, error, isLoading } = useQuery<AccountData>({
        queryKey: ["user", user_id],
        queryFn: () => getAccountData(user_id),
        enabled: !!user_id,
        retry: 0
    });

    return { data, error: error as Error | null, isLoading };
};