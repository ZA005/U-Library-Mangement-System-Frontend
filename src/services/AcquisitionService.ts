import axios from "axios";

export interface AcquisitionRecord {
    id: number;
    book_title: string;
    isbn: string;
    publisher: string;
    edition: string;
    published_date: string;
    purchase_price: number;
    purchase_date: string;
    acquired_date: string;
    vendor: string;
    vendor_location: string;
    funding_source: string;
}

const BASE_URL = "http://localhost:8080/adminuser";

export const addRecords = async (records: AcquisitionRecord[]): Promise<AcquisitionRecord[]> => {
    try {
        const response = await axios.post<AcquisitionRecord[]>(`${BASE_URL}/add-record`, records, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const statusCode = error.response.status;
                const responseData = error.response.data;

                if (statusCode === 400) {
                    throw new Error(`Bad Request: ${responseData.message || JSON.stringify(responseData)}`);
                } else if (statusCode === 401) {
                    throw new Error(`Unauthorized: ${responseData.message || JSON.stringify(responseData)}`);
                } else if (statusCode === 409) {
                    throw new Error(`${responseData.error || "Conflict"}: ${responseData.message}`);
                } else if (statusCode >= 500) {
                    throw new Error(`Server Error: ${responseData.message || JSON.stringify(responseData)}`);
                } else {
                    throw new Error(`Error ${statusCode}: ${responseData.message || JSON.stringify(responseData)}`);
                }
            } else if (error.request) {
                throw new Error("No response received from the server");
            } else {
                throw new Error(error.message);
            }
        } else {
            throw new Error('An unexpected error occurred while adding records');
        }
    }
}

export const fetchAllPendingCatalogRecords = async (): Promise<AcquisitionRecord[]> => {
    try {
        const response = await axios.get<AcquisitionRecord[]>(`${BASE_URL}/pending`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
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