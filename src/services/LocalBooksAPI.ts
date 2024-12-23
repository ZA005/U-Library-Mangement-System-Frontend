// src/api/BookAPI.ts
import axios from "axios";

const BASE_URL = "http://localhost:8080/adminuser/";

export const getAllBooks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}all-books`);
        return response.data; // return the data from the response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new Error("Failed to fetch books from the database.");
    }
};
