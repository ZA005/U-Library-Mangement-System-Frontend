import { createApiClient } from "../api/apiClient";
import { AccountData } from "../../types";

const getAccountData = async (user_id: string): Promise<AccountData> => {
    const apiClient = createApiClient('public/account')

    try {
        const response = await apiClient.get(`/${user_id}`)
        console.log(response.data)
        return response.data;
    } catch (e) {
        console.error(e)
        throw (e)
    }
}

export default getAccountData