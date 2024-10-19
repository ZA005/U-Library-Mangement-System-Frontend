import axios from "axios";
 
const REST_API_BASE_URL = 'http://localhost:8080/api/users';

export interface LoginCredentials {
    libraryCardNumber: string;
    password: string;
}

export interface RegistrationFormData {
    libraryCardNumber: string;
    password: string;
    schoolId: string;
    userType: string;
}


export const checkUserCredentials = async (credentials: LoginCredentials) => {
    try {
        const response = await axios.post(`${REST_API_BASE_URL}/login`, credentials);
        return response.data;  // return user data if the credentials are correct
    } catch (error) {
        // Handle errors, e.g. incorrect credentials, user not found, etc.
        console.error("Error verifying user credentials", error);
        throw error;
    }
};

export const listUsers = () => axios.get(REST_API_BASE_URL);

// Function to register a new user
export const registerUser = async (formData: RegistrationFormData) => {
    try {
        const response = await axios.post(`${REST_API_BASE_URL}/register`, formData);
        return response.data;
    } catch (error) {
        console.error("Error registering user", error);
        throw error;
    }
};