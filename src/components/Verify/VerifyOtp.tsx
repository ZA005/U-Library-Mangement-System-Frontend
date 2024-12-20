/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import UserService from "../../services/UserService";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./VerifyOtp.css";

const VerifyOtp: React.FC = () => {
    const [otp, setOtp] = useState<string>(""); // Store OTP input
    const [error, setError] = useState<string | null>(null); // Store error messages
    const [loading, setLoading] = useState<boolean>(false); // Show loading state
    const location = useLocation();
    const userData = location.state?.userData;
    const navigate = useNavigate();

    // Get the email from localStorage
    const emailAdd = localStorage.getItem("emailAdd");

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!emailAdd) {
            setError("Email is missing. Please make sure you are logged in.");
            setLoading(false);
            return;
        }

        try {
            // Call the backend service to verify the OTP
            const response = await UserService.verifyOTP(emailAdd, otp);

            if (response.success === "true") {
                // OTP verified successfully, navigate to the next page (e.g., dashboard)
                navigate("/register", { state: { userData } });
            } else {
                // If OTP verification failed, display the error message
                setError(response.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            setError("Error verifying OTP. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify-otp-page">
            <Header buttons={null} />
            <div className="verify-otp-container">
                <h2 className="verify-otp-title">Verify OTP</h2>
                {error && <p className="verify-otp-error">{error}</p>}
                <form onSubmit={handleSubmit} className="verify-otp-form">
                    <div className="form-group">
                        <label className="form-label">Enter OTP:</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter the OTP you received"
                            required
                            className="form-input"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="verify-otp-button"
                    >
                        {loading ? "Verifying..." : "Submit"}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default VerifyOtp;
