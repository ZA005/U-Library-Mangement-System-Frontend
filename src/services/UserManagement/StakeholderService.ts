import axios from "axios";

const BASE_URL = "http://localhost:8080/verify";

export const getUserDetails = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/librarycard/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}; 