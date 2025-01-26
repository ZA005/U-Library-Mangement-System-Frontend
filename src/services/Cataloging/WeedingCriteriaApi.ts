/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { WeedingCriteria } from "../../model/Criteria";

const BASE_URL = "http://localhost:8080/admin/weeding-criteria";

export const addWeedingCriteria = async (criteria: any) => {
    try {
        const response = await axios.post(`${BASE_URL}`, criteria, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add weeding criteria:', error);
        throw error;
    }
};

export const getAllWeedingCriteria = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add weeding criteria:', error);
        throw error;
    }
};

export const updateWeedingCriteria = async (criteria: WeedingCriteria) => {
    try {
        const response = await axios.put(`${BASE_URL}/update-criteria`, criteria, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        return response.data; // Return the updated criteria object
    } catch (error) {
        console.error('Failed to update weeding criteria status:', error);
        throw error; // Rethrow the error for further handling
    }
}

export const deleteWeedingCriteria = async (id: number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        return response.data; // Return the updated criteria object
    } catch (error) {
        console.error('Failed to update weeding criteria status:', error);
        throw error; // Rethrow the error for further handling
    }
}



