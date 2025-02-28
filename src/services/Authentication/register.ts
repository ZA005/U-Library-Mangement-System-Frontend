import { createApiClient } from "../api/apiClient";
import { AccountData, AuthResponse } from "../../types";

const register = async (account: AccountData): Promise<AuthResponse> => {
    const apiClient = createApiClient('auth')

    try {
        const response = await apiClient.post<AuthResponse>('/register', account)

        return response.data
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default register