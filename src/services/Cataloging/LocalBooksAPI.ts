/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/api/BookAPI.ts
import axios from "axios";
import { Locations, Sections } from "../../model/Book";

const BASE_URL = "http://localhost:8080/adminuser/";
const BASE_URL_ADMIN = "http://localhost:8080/admin/";

export const getAllBooks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}all-books`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data; // return the data from the response
    } catch (error) {
        throw new Error("Failed to fetch books from the database.");
    }
};

export const getBooksByAuthor = async (authorName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}books-by-author`, {
            params: { authorName },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch books by the author.");
    }
};

export const fetchLastAccessionNumber = async (locationPrefix: string): Promise<string> => {
    try {
        const response = await axios.get(`${BASE_URL}last-accession-number`, {
            params: { locationPrefix },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }

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
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching books by advanced search:", error);
        throw new Error("Failed to fetch books by advanced search.");
    }
};


export const getLastAccessionNumber = async () => {
    try {
        const response = await axios.get(`${BASE_URL}last-added-accession`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data; // Return the last added accession number
    } catch (e) {
        console.error("Error fetching last added accession number:", e);
        throw e; // Optionally, you can throw the error for further handling
    }
};


export const getAllLibraries = async () => {
    try {
        const response = await axios.get(`${BASE_URL_ADMIN}location`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (e) {
        console.error("Failed to get all library locations:", e);
        throw e;
    }
};

export const addLibrary = async (library: Locations) => {
    try {
        // Assuming LocationDTO matches Locations, otherwise adjust this part
        const response = await axios.post(`${BASE_URL_ADMIN}location`, library, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data as Locations; // Cast to Locations if you're sure about the structure
    } catch (e) {
        console.error("Failed to add library location:", e);
        throw e;
    }
};

export const deleteLocation = async (id: number) => {
    try {
        const response = await axios.delete(`${BASE_URL_ADMIN}location/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to delete location:', error);
        throw error;
    }
};

export const getAllSections = async (locationId: number) => {
    try {
        const response = await axios.get(`${BASE_URL_ADMIN}section/${locationId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (e) {
        console.error("Failed to get all library locations:", e);
        throw e;
    }
};

export const addSection = async (section: Sections) => {
    try {
        const response = await axios.post(`${BASE_URL_ADMIN}section`, section, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data as Sections; // Cast to Locations if you're sure about the structure
    } catch (e) {
        console.error("Failed to add library location:", e);
        throw e;
    }
};

export const deleteSection = async (id: number) => {
    try {
        const response = await axios.delete(`${BASE_URL_ADMIN}section/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to delete location:', error);
        throw error;
    }
};

export const getAllAccessionNo = async () => {
    try {
        const response = await axios.get(`${BASE_URL}all-accession-number`);
        return response.data; // return the data from the response
    } catch (error) {
        throw new Error("Failed to fetch books from the database.");
    }
};