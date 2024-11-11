import React, { useState } from "react";
import UserService from "../services/UserService";
import { useNavigate } from "react-router-dom";


const VerifyOtp: React.FC = () => {
    const [otp, setOtp] = useState<string>(''); // Store OTP input
    const [error, setError] = useState<string | null>(null); // Store error messages
    const [loading, setLoading] = useState<boolean>(false); // Show loading state
    const navigate = useNavigate();

    // Get the email from localStorage
    const emailAdd = localStorage.getItem('emailAdd');

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!emailAdd) {
            setError('Email is missing. Please make sure you are logged in.');
            setLoading(false);
            return;
        }

        try {
            // Call the backend service to verify the OTP
            const response = await UserService.verifyOTP(emailAdd, otp);

            if (response.success === "true") {
                // OTP verified successfully, navigate to the next page (e.g., dashboard)
                navigate('/register');
            } else {
                // If OTP verification failed, display the error message
                setError(response.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            setError('Error verifying OTP. Please try again later.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div>
            <h2>Verify OTP</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Enter OTP:</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter the OTP you received"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default VerifyOtp;