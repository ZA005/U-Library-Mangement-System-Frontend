import axios from "axios";

const BASE_URL = "http://localhost:8080/";

export const saveLoanDetails = async (loanData: unknown): Promise<void> => {
    console.log("Loan Data:", loanData);

    try {
        const response = await axios.post(`${BASE_URL}admin/save-loan`, loanData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log("Loan details saved successfully:", response.data);
    } catch (error) {
        throw new Error("Failed to save loan details: " + error);
    }
};

export const getAllLoans = async () => {
    try {
        const response = await axios.get(`${BASE_URL}admin/all-loans`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch laons from the database." + error);
    }
};

export const fetchBorrowerDetails = async (libraryCardNumber: string): Promise<{ department: string }> => {
    try {
        const response = await axios.get(`${BASE_URL}admin/borrower-details/${libraryCardNumber}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch borrower details: " + error);
    }
};


export const fetchBookDetails = async (barcode: string): Promise<{ accessionNo: string, title: string, callNumber: string, authors: string }> => {
    try {
        const response = await axios.get(`${BASE_URL}adminuser/barcode/${barcode}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data; // Ensure the backend returns `{ bookTitle, author }`
    } catch (error) {
        throw new Error("Failed to fetch book details: " + error);
    }
}

export const getLoanById = async (loanId: bigint) => {
    try {
        const response = await axios.get(`${BASE_URL}admin/loans/barcode/${loanId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch loan by barcode: " + error);
    }
};

export const updateLoanStatus = async (loanId: bigint, status: string) => {
    try {
        const response = await axios.put(`${BASE_URL}admin/update/${loanId}`, { status }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to update loan status: " + error);
    }
};

