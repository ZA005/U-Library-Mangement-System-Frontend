/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const fetchLastAccessionNumber = async (locationPrefix: string): Promise<string> => {
    try {
        const response = await axios.get(`${BASE_URL}last-accession-number`, {
            params: { locationPrefix },
        });
        return response.data; // Returns the last accession number as a string
    } catch (error) {
        console.error("Error fetching last accession number:", error);
        throw new Error("Failed to fetch last accession number.");
    }
};

export const fetchCopyNumBookExist = async (title: string, isbn10: string, isbn13: string, locationPrefix: string): Promise<string> => {
    try {
        const response = await axios.get(`${BASE_URL}latest-accession`, {
            params: { title, isbn10, isbn13, locationPrefix },
        });
        return response.data; // Returns the latest accession number as a string
    } catch (error) {
        console.error("Error fetching latest accession number:", error);
        throw new Error("Failed to fetch latest accession number.");
    }
};





export const getBooksByAdvancedSearch = async (searchParams: any) => {
    console.log(searchParams);
    try {
        const response = await axios.post(`${BASE_URL}advance-search`, searchParams, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching books by advanced search:", error);
        throw new Error("Failed to fetch books by advanced search.");
    }
};


