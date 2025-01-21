/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const BASE_URL = "http://localhost:8080/sru";

export const searchGoogleBooks = async (query: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/googlebooks/search`, {
            params: { query },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Check if there are items in the response
        const books = response.data.items.map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            subtitle: item.volumeInfo.subtitle,
            authors: item.volumeInfo.authors || ['Unknown Author'],
            publisher: item.volumeInfo.publisher,
            publishedDate: item.volumeInfo.publishedDate,
            description: item.volumeInfo.description || 'No description available',
            pageCount: item.volumeInfo.pageCount,
            categories: item.volumeInfo.categories || [],
            language: item.volumeInfo.language,
            isbn10: item.volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier,
            isbn13: item.volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier,
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
            printType: item.volumeInfo.printType || 'N/A'
        }));

        return books;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const saveBook = async (bookData: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/save`, bookData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('Error saving book:', error);
        throw error;
    }
};

export const generateCallNumber = async (
    category: string,
    authors: string[],
    publishedDate: string,
    title: string,
) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/generate-call-number`,
            { category, authors, publishedDate, title }, // Request body
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error generating call number:', error);
        throw error;
    }
};





