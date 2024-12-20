import axios from "axios";

interface UserData {
    libraryCardNumber: string;
    schoolId: string;
    role: string;
    password: string;
}

class UserService {
    static BASE_URL = "http://localhost:8080";

    static async login(libraryCardNumber: string, password: string) {
        const response = await axios.post(`${UserService.BASE_URL}/user/auth/login`, { libraryCardNumber, password });
        console.log('Login Response:', response); //Debugging
        return response.data;
    }

    static async register(userData: UserData) {
        console.log('User Data:', userData);  // Log user data to check before the request
        const response = await axios.post(`${UserService.BASE_URL}/user/auth/register`, userData);
        return response.data;
    }

    static async verifyUser(id: string) {
        const response = await axios.get(`${UserService.BASE_URL}/verify/${id}`);
        console.log('Verify Student Response:', response); //Debugging
        return response.data;
    }

    static async verifyOTP(emailAdd: string, otp: string) {

        console.log("Verifying OTP with email:", emailAdd, "and OTP:", otp);

        const response = await axios.post(`${UserService.BASE_URL}/verify/confirm-otp`, {
            emailAdd, // Send 'email' as a query parameter
            otp    // Send 'otp' as a query parameter
        });
        return response.data;
    }






    /** AUTHENTICATION CHECKER */
    static logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        // Log the result to see if the items were removed
        console.log('Token removed:', !localStorage.getItem('token'));
        console.log('Role removed:', !localStorage.getItem('role'));
    }


    static isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin(): boolean {
        const role = localStorage.getItem('role');
        return role === 'LIBRARIAN';
    }

    static isUser(): boolean {
        const role = localStorage.getItem('role');
        return role === 'STUDENT';
    }

    static adminOnly(): boolean {
        return this.isAuthenticated() && this.isAdmin();
    }

    static userOnly(): boolean {
        return this.isAuthenticated() && this.isUser();
    }
}

export default UserService;

