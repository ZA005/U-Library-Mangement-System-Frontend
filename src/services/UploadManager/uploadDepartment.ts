import { createApiClient } from "../api/apiClient";
import { Department } from "../../types";

const uploadDepartments = async (departments: Department[]): Promise<Department[]> => {
    const apiClient = createApiClient("public/departments")

    try {
        const response = await apiClient.post('/upload', departments);
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}
export default uploadDepartments