import { createApiClient } from "../../api/apiClient";
import { Course } from "../../../types";

const uploadCourse = async (courses: Course[]): Promise<Course[]> => {
    const apiClient = createApiClient("public/courses")

    try {
        console.log("RUN")
        const response = await apiClient.post('/upload', courses, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        console.log("RESPONSE:", response)
        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}
export default uploadCourse