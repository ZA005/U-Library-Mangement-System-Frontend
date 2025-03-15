import { createApiClient } from "../../api/apiClient";
import { Course } from "../../../types";

const getAllCourseByRevision = async (id: number): Promise<Course[]> => {
    const apiClient = createApiClient("public")
    try {
        const response = await apiClient.get(`/courses/program/curriculum/rev/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export default getAllCourseByRevision