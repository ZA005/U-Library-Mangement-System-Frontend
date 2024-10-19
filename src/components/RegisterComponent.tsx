/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { registerUser, RegistrationFormData } from '../services/UserService';



const RegistrationPage: React.FC = () => {
    const [formData, setFormData] = useState<RegistrationFormData>({
        libraryCardNumber: '',
        password: '',
        schoolId: '',
        userType: 'student', // Default userType
    });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            setSuccessMessage('Registration successful!');
            setError(null);
        } catch (error) {
            setError('Registration failed. The library card number might already exist.');
            setSuccessMessage(null);
        }
    };

    return (
        <div className="registration-page">
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="libraryCardNumber">Library Card Number:</label>
                    <input
                        type="text"
                        id="libraryCardNumber"
                        name="libraryCardNumber"
                        value={formData.libraryCardNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="schoolId">School ID:</label>
                    <input
                        type="text"
                        id="schoolId"
                        name="schoolId"
                        value={formData.schoolId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="userType">User Type:</label>
                    <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        required
                    >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegistrationPage;
