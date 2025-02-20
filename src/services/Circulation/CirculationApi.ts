import axios from "axios";
import { Book } from "../../model/Book";

const BASE_URL = "http://localhost:8080/";

export const saveLoanDetails = async (loanData: unknown) => {
    try {
        await axios.post(`${BASE_URL}adminuser/save-loan`, loanData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return loanData;
    } catch (error) {
        throw new Error("Failed to save loan details: " + error);
    }
};

export const getBooksByISBN = async (isbn13: string): Promise<Book[]> => {
    try {
        const response = await axios.get(`${BASE_URL}adminuser/isbn13/${isbn13}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const books = response.data;
        return books;
    } catch (error) {
        console.log("Failed to fetch book: " + error);
        return [];
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

export const fetchBorrowerDetails = async (idNumber: string): Promise<{
    department: string,
    hasCurrentBorrowedBook: boolean,
    registered: boolean,
    reservationCount: number
}> => {
    try {
        const response = await axios.get(`${BASE_URL}adminuser/borrower-details/${idNumber}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch borrower details: " + error);
    }
};

//Book Controller
export const fetchBookDetails = async (accessionNo: string): Promise<{ title: string, callNumber: string, authors: string, bookStatus: string }> => {
    try {
        const response = await axios.get(`${BASE_URL}adminuser/accessionNo/${accessionNo}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch book details: " + error);
    }
}

export const getLoanById = async (loanId: bigint) => {
    try {
        const response = await axios.get(`${BASE_URL}admin/loans/accessionNo/${loanId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch loan by Accession Number: " + error);
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
        return response.data.isLoaned;
    } catch (error) {
        throw new Error("Failed to check book loan status: " + error);
    }
};




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

export const getUserCirculationDetails = async () => {
    try {
        const response = await axios.get(`${BASE_URL}adminuser/get-user-circulation-details`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch user circulation details: " + error);
    }
}

//Resertvation Controller
export const getAllReservations = async () => {
    try {
        const response = await axios.get(`${BASE_URL}adminuser/reservation/all-reservations`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.log("Failed to fetch reservations: " + error);
    }
};

export const getBookDetailsForReservation = async (accessionNo: string) => {
    try {
        const response = await axios.get(`${BASE_URL}adminuser/reservation/accessionNo/${accessionNo}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.log("Error fetching book detaoils for reservation", error);
    }
}

export const saveReservation = async (reservation: unknown) => {
    try {
        const response = await axios.post(`${BASE_URL}adminuser/reservation/save-reservation`, reservation, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.log("Error saving reservation", error);
    }
};

export const updateFinePaidStatus = async (id: number) => {
    try {
        const res = await axios.put(`${BASE_URL}adminuser/paid/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return res.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}