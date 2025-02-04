import axios from 'axios';
import { Book } from '../../model/Book';
export interface BookReference {
    id: number;

    // COURSE ARRTRIBS
    course_id: number;
    course_name: string;

    // BOOK ATTRIBS
    book_id: number;
    book_name: string;
    isbn10: string;
    isbn13: string;
    language: string;
    location: string;

    status: number;
}

const BASE_URL = "http://localhost:8080/";

export const getAllBookRef = async (): Promise<BookReference[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/reference`);
        return response.data;
    } catch (error) {
        console.error("Error fetching references:", error)
        throw error;
    }
}

export const getAllBookRefByCourse = async (id: number): Promise<BookReference[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/reference/course/${id}`);

        return response.data;
    } catch (error) {
        console.error("Error fetching subjects:", error)
        throw error;
    }
}


export const addBookRef = async (newBookRef: BookReference): Promise<BookReference> => {
    try {
        const response = await axios.post(`${BASE_URL}public/reference`, newBookRef);

        return response.data;
    } catch (error) {
        console.error("Error adding Book Reference:", error);
        throw error;
    }
}

export const addMultipleBookRef = async (newBookRef: BookReference[]): Promise<BookReference[]> => {
    try {
        const response = await axios.post(`${BASE_URL}public/reference/multiple`, newBookRef);

        return response.data;
    } catch (error) {
        console.error("Error adding Book Reference:", error);
        throw error;
    }
}

export const updateBookRef = async (id: number, bookRef: BookReference): Promise<BookReference> => {
    try {
        const response = await axios.put(`${BASE_URL}public/reference/${id}`, bookRef);

        return response.data;
    } catch (error) {
        console.error("Error updating book reference:", error)
        throw error;
    }
}



// FETCHING BOOKS
export const getAllUniqueBooks = async (): Promise<Book[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/reference/book`);
        return response.data;
    } catch (error) {
        console.error("Error fetching references:", error)
        throw error;
    }
}

export const getAllNotReferencedBook = async (id: number): Promise<Book[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/reference/book/course/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching subjects:", error)
        throw error;
    }
}