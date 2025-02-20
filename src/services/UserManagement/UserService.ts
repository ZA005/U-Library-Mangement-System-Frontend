import axios from "axios";

interface UserData {
    libraryCardNumber: string;
    schoolId: string;
    role: string;
    password: string;
}

class UserService {
    static BASE_URL = "http://localhost:8080";

    static async login(schoolId: string, password: string) {
        const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { schoolId, password });
        console.log('Login Response:', response); //Debugging
        return response.data;
    }

    static async register(userData: UserData) {
        console.log('User Data:', userData);  // Log user data to check before the request
        const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData);
        return response.data;
    }

    static async verifyUser(id: string) {
        console.log(`${UserService.BASE_URL}/verify/${id}`);
        const response = await axios.get(`${UserService.BASE_URL}/verify/${id}`);
        console.log('Verify Student Response:', response);
        return response.data;
    }

    static async verifyOTP(emailAdd: string, otp: string) {
        const response = await axios.post(`${UserService.BASE_URL}/verify/confirm-otp`, {
            emailAdd,
            otp
        });
        return response.data;
    }

    static async isActivated(uncIdNumber: string) {
        const response = await axios.get(`${UserService.BASE_URL}/verify/activation-status/${uncIdNumber}`);
        return response.data;
    }






    /** AUTHENTICATION CHECKER */
    static logout(): void {
        localStorage.clear();

        // Log the result to see if the items were removed
        console.log('Token removed:', !localStorage.getItem('token'));
        console.log('Role removed:', !localStorage.getItem('role'));
    }


    static isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isLibrarian(): boolean {
        const role = localStorage.getItem('role');
        return role === 'LIBRARIAN';
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
        return this.isAuthenticated() && (this.isLibrarian() || this.isAdmin());
    }

    static userOnly(): boolean {
        return this.isAuthenticated() && this.isUser();
    }
}

export default UserService;

