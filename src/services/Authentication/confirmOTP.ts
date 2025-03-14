import { createApiClient } from "../api/apiClient";

const confirmOTP = async (emailAdd: string, otp: string) => {
    const apiClient = createApiClient('verify')

    try {

        const response = await apiClient.post(`/otp`, { emailAdd, otp })
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default confirmOTP