import { createApiClient } from "../../api/apiClient";
import { Course } from "../../../types";

const uploadCourse = async (courses: Course[]): Promise<Course[]> => {
    const apiClient = createApiClient("public/courses")

    try {
        const response = await apiClient.post('/upload', courses);
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}
export default uploadCourse