/* eslint-disable @typescript-eslint/no-unused-vars */
// src/api/BookAPI.ts
import axios from "axios";

const BASE_URL = "http://localhost:8080/adminuser/";

export const getAllBooks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}all-books`);
        return response.data; // return the data from the response
    } catch (error) {
        throw new Error("Failed to fetch books from the database.");
    }
};

export const getBooksByAuthor = async (authorName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}books-by-author`, { params: { authorName } });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch books by the author.");
    }
};

