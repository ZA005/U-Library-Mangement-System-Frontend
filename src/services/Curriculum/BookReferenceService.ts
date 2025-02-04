import axios from 'axios';

export interface BookReference {
    id: number;

    // COURSE ARRTRIBS
    course_id: number;
    course_number: string;

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

export const updateBookRef = async (id: number, bookRef: BookReference): Promise<BookReference> => {
    try {
        const response = await axios.put(`${BASE_URL}public/reference/${id}`, bookRef);

        return response.data;
    } catch (error) {
        console.error("Error updating book reference:", error)
        throw error;
    }
}