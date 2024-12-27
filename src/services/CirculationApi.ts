import axios from "axios";

const BASE_URL = "http://localhost:8080/admin/";

export const getAllLoans = async () => {
    try {
        const response = await axios.get(`${BASE_URL}all-loans`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch laons from the database." + error);
    }
}; 