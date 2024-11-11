import axios from "axios";


// interface UserData {
//     libraryCardNumber: string;
//     password: string;
//     // Add other fields as necessary for user registration
// }

// interface UserResponse {
//     message: string;
//     token: string;
//     role: string;
//     // Include other fields as necessary based on your API response
// }

class UserService {
    static BASE_URL = "http://localhost:8080";

    static async login(libraryCardNumber: string, password: string) {
        const response = await axios.post(`${UserService.BASE_URL}/user/auth/login`, { libraryCardNumber, password });
        console.log('Login Response:', response); //Debugging
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
    }

    static isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin(): boolean {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
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

