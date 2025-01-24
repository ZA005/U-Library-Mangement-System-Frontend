import axios from "axios";

export interface MARC {
    id: number;
    isbn: string;
    catSource: string;
    locCallNumber: string;
    ddc: string;
    personalName: string;
    corporateName: string;
    title: string;
    edition: string;
    publisher: string;
    physicalDesc: string;
    content: string;
    media: string;
    gender: string;
    associatedLanguage: string;
    series: string;
    biblio: string;
    contentNote: string;
    productionNote: string;
    summary: string;
    targetAudience: string;
    fundingSource: string;
    tropicalTerm: string;
    historicalData: string;
    otherAuthors: string;
}

const BASE_URL = "http://localhost:8080/adminuser";


export const addRecord = async (newMARCRecord: MARC): Promise<MARC> => {
    try {
        const response = await axios.post(`${BASE_URL}/add-marc-record`, newMARCRecord, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            let errorMessage = "Failed to add records";
            if (error.response) {
                errorMessage += `: ${error.response.status} - ${error.response.data}`;
            }
            if (error.request) {
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