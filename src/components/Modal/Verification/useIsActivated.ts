import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isActivated } from "../../../services/Authentication";

export const useIsActivated = () => {
    const [userId, setUserId] = useState<string | null>(null);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['isActivated', userId],
        queryFn: () => (userId ? isActivated(userId) : Promise.reject("User ID is required")),
        enabled: false, // Do not run automatically
        retry: 1,
    });

    // Function to trigger activation check manually
    const checkIsActivated = async (id: string) => {
        setUserId(id); // Set userId before triggering refetch
        return refetch();
    };

    return {
        isActivated: data?.isActivated ?? false,
        isLoading,
        isError,
        error,
        checkIsActivated,
    };
};
