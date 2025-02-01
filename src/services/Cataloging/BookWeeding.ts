import axios from "axios"
import { WeedInfos } from "../../model/Criteria";

const BASE_URL = "http://localhost:8080/admin/book-weeding";

export const manualBookWeedFlagging = async () => {
    try {
        const response = await axios.post(
            `${BASE_URL}/test`,
            {}, // The empty object is the body of the request (you can replace it with actual data if needed)
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
        );
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        console.error('Failed to trigger flagging: ', error);
        throw error;
    }
}

export const getAllBookWeeding = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get all the books flagged to weed: ', error);
        throw error;
    }
}

export const toWeedBook = async (bookWeed: WeedInfos): Promise<WeedInfos> => {
    try {
        const response = await axios.post(`${BASE_URL}/weed`, bookWeed, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // Assuming the server returns the updated book in the response
        return response.data; // This should be the updated book data
    } catch (error) {
        console.log('Failed to weed the book: ', error);
        throw error;
    }
};

export const toUpdateWeedingProcess = async (bookWeed: WeedInfos): Promise<void> => {
    try {
        const response = await axios.post(`${BASE_URL}/weed-process`, bookWeed, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.log('Failed to weed the book: ', error);
        throw error;
    }
}
