import axios from "axios";

export interface AcquisitionRecord {
    id: number;
    book_title: string;
    isbn: string;
    publisher: string;
    edition: string;
    series: string;
    purchase_price: number;
    purchase_date: string;
    acquired_date: string;
    vendor_name: string;
    vendor_location: string;
    funding_source: string;
}

const BASE_URL = "http://localhost:8080/";

export const addRecords = async (records: AcquisitionRecord[]): Promise<AcquisitionRecord[]> => {
    try {
        const response = await axios.post<AcquisitionRecord[]>(`${BASE_URL}public/acquisition`, records);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            let errorMessage = "Failed to add records";
            if (error.response) {
                errorMessage += `: ${error.response.status} - ${error.response.data}`;
            } else if (error.request) {
                errorMessage += ": No response received from the server";
            } else {
                errorMessage += `: ${error.message}`;
            }
            console.error("Error adding records:", errorMessage);
            throw new Error(errorMessage);
        } else {
            console.error("Error adding records:", error);
            throw new Error('An unexpected error occurred while adding records');
        }
    }
}

export const fetchAllPendingCatalogRecords = async (): Promise<AcquisitionRecord[]> => {
    try {
        const response = await axios.get<AcquisitionRecord[]>(`${BASE_URL}public/acquisition`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            let errorMessage = "Failed to fetch pending records";
            if (error.response) {
                errorMessage += `: ${error.response.status} - ${error.response.data}`;
            } else if (error.request) {
                errorMessage += ": No response received from the server";
            } else {
                errorMessage += `: ${error.message}`;
            }
            console.error("Error fetching records:", errorMessage);
            throw new Error(errorMessage);
        } else {
            console.error("Error fetching records:", error);
            throw new Error('An unexpected error occurred while fetching records');
        }
    }
};

export const updateStatus = async (id: number): Promise<boolean> => {
    try {
        const response = await axios.post(`${BASE_URL}/update-status/${id}`, null, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            let errorMessage = "Failed to update status";
            if (error.response) {
                errorMessage += `: ${error.response.status} - ${error.response.data}`;
            } else if (error.request) {
                errorMessage += ": No response received from the server";
            } else {
                errorMessage += `: ${error.message}`;
            }
            console.error("Error updating status:", errorMessage);
            throw new Error(errorMessage);
        } else {
            console.error("Error updating status:", error);
            throw new Error('An unexpected error occurred while updating status');
        }
    }
};