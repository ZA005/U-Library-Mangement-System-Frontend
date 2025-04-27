import { createApiClient } from "../../api/apiClient";

const addFlaggedBooks = async (initiator: string): Promise<string> => {
    const apiClient = createApiClient("admin");
    try {
        const response = await apiClient.post<string>(
            `/book/weeding/initiate`,
            {},
            {
                params: { initiator },
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error initiating weeding process:", error);
        throw error;
    }
};

export default addFlaggedBooks;