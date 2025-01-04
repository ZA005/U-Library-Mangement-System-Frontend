import axios from 'axios';

export interface BookReference {
    id: number;
    subject_id: number;
    subject_name: string;
    book_name: string;
    status: number;
    urlPath: string;
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

export const getAllBookRefBySubject = async (id: number): Promise<BookReference[]> => {
    try {
        const response = await axios.get(`${BASE_URL}public/reference/subject/${id}`);

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