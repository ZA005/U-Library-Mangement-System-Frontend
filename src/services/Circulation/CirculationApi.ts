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

export const getBorrowedLoans = async () => {
    try {
        const response = await axios.get(`${BASE_URL}admin/borrowed-loans`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data
    } catch (error) {
        throw new Error("Failed to fetch laons from the database." + error);
    }
}

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


export const fetchBookDetails = async (accessionNo: string): Promise<{ title: string, callNumber: string, authors: string }> => {
    try {
        const response = await axios.get(`${BASE_URL}adminuser/accessionNo/${accessionNo}`, {
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

export const updateLoanStatus = async (loanId: bigint, status: string, action: string) => {
    try {
        const response = await axios.put(`${BASE_URL}admin/update/${loanId}?action=${action}`, { status }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to update loan status: " + error);
    }
};

export const checkBookLoanStatus = async (accessionNo: string): Promise<boolean> => {
    try {
        const response = await axios.get(`${BASE_URL}admin/check-book-loan-status/accessionNo/${accessionNo}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data.isLoaned;  // Assuming the backend returns a boolean indicating the loan status
    } catch (error) {
        throw new Error("Failed to check book loan status: " + error);
    }
};

// export const getOverdueLoans = async () => {
//     try {
//         const response = await axios.get(`${BASE_URL}admin/overdue`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error("Failed to fetch overdue loans: " + error);
//     }
// }

export const calculateFines = async () => {
    const response = await axios.post(`${BASE_URL}adminuser/calculate`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};

export const getAllFines = async () => {
    try {
        const response = await axios.get(`${BASE_URL}adminuser/get-all-fines`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch fines: " + error);
    }
}

export const getAllFineDetails = async () => {
    try {
        const response = await axios.get(`${BASE_URL}adminuser/get-all-fine-details`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch fines: " + error);
    }
}